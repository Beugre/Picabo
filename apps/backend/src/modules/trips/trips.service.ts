import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus, PaymentStatus } from './entities/trip.entity';
import { TripEvent } from './entities/trip-event.entity';
import { DriverProfile, DriverStatus } from '../drivers/entities/driver-profile.entity';
import { PassengerProfile } from '../passengers/entities/passenger-profile.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { CancelTripDto } from './dto/cancel-trip.dto';
import { SelectBidDto } from './dto/select-bid.dto';
import { PricingService } from '../pricing/pricing.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { BiddingService } from '../bidding/bidding.service';

const BIDDING_WINDOW_SECONDS = 90; // 90 seconds for drivers to bid

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(TripEvent) private eventRepo: Repository<TripEvent>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    @InjectRepository(PassengerProfile) private passengerRepo: Repository<PassengerProfile>,
    private pricingService: PricingService,
    private geoService: GeolocationService,
    private biddingService: BiddingService,
  ) {}

  async createTrip(passengerUserId: string, dto: CreateTripDto): Promise<Trip> {
    const distanceM = this.geoService.calculateDistance(
      dto.pickupLat, dto.pickupLng,
      dto.dropoffLat, dto.dropoffLng,
    );
    const durationS = this.geoService.estimateEta(distanceM);

    const priceEstimate = await this.pricingService.calculatePrice(
      distanceM,
      durationS,
      dto.vehicleCategoryId,
    );

    const trip = this.tripRepo.create({
      passengerId: passengerUserId,
      status: TripStatus.BIDDING_OPEN,
      pickupLat: dto.pickupLat,
      pickupLng: dto.pickupLng,
      pickupAddress: dto.pickupAddress,
      dropoffLat: dto.dropoffLat,
      dropoffLng: dto.dropoffLng,
      dropoffAddress: dto.dropoffAddress,
      estimatedDistanceM: distanceM,
      estimatedDurationS: durationS,
      proposedPrice: priceEstimate.suggestedPrice,
      vehicleCategoryId: dto.vehicleCategoryId,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
      biddingExpiresAt: new Date(Date.now() + BIDDING_WINDOW_SECONDS * 1000),
    });

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(saved.id, 'trip_created', 'passenger', passengerUserId, { priceEstimate });

    return saved;
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['passenger', 'driver', 'vehicleCategory'],
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async selectBid(tripId: string, passengerUserId: string, dto: SelectBidDto): Promise<Trip> {
    const trip = await this.findById(tripId);
    if (trip.passengerId !== passengerUserId) throw new ForbiddenException();
    if (trip.status !== TripStatus.BIDDING_OPEN) {
      throw new BadRequestException('Cannot select bid in current trip state');
    }

    const bid = await this.biddingService.acceptBid(dto.bidId, passengerUserId);

    trip.status = TripStatus.DRIVER_SELECTED;
    trip.driverId = bid.driverId;
    trip.selectedPrice = Number(bid.amount);

    await this.driverRepo.update({ userId: bid.driverId }, { status: DriverStatus.ON_TRIP });

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(tripId, 'bid_accepted', 'passenger', passengerUserId, { bidId: dto.bidId });
    return saved;
  }

  async driverArrived(tripId: string, driverUserId: string): Promise<Trip> {
    const trip = await this.findById(tripId);
    if (trip.driverId !== driverUserId) throw new ForbiddenException();
    if (trip.status !== TripStatus.DRIVER_SELECTED && trip.status !== TripStatus.DRIVER_EN_ROUTE) {
      throw new BadRequestException('Cannot mark arrived in current trip state');
    }

    trip.status = TripStatus.DRIVER_ARRIVED;
    trip.tripArrivedAt = new Date();

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(tripId, 'driver_arrived', 'driver', driverUserId);
    return saved;
  }

  async startTrip(tripId: string, driverUserId: string): Promise<Trip> {
    const trip = await this.findById(tripId);
    if (trip.driverId !== driverUserId) throw new ForbiddenException();
    if (trip.status !== TripStatus.DRIVER_ARRIVED) {
      throw new BadRequestException('Cannot start trip in current state');
    }

    trip.status = TripStatus.TRIP_IN_PROGRESS;
    trip.tripStartedAt = new Date();

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(tripId, 'trip_started', 'driver', driverUserId);
    return saved;
  }

  async completeTrip(tripId: string, driverUserId: string): Promise<Trip> {
    const trip = await this.findById(tripId);
    if (trip.driverId !== driverUserId) throw new ForbiddenException();
    if (trip.status !== TripStatus.TRIP_IN_PROGRESS) {
      throw new BadRequestException('Cannot complete trip in current state');
    }

    const now = new Date();
    const actualDurationS = trip.tripStartedAt
      ? Math.round((now.getTime() - trip.tripStartedAt.getTime()) / 1000)
      : trip.estimatedDurationS;

    // Recalculate final price based on actual duration
    let finalPrice = trip.selectedPrice || trip.proposedPrice;
    if (trip.vehicleCategoryId && actualDurationS) {
      try {
        const recalc = await this.pricingService.calculatePrice(
          trip.estimatedDistanceM,
          actualDurationS,
          trip.vehicleCategoryId,
        );
        // Final price is the bid price (already agreed), but can add time surcharge if much longer
        finalPrice = trip.selectedPrice || recalc.suggestedPrice;
      } catch {}
    }

    trip.status = TripStatus.COMPLETED;
    trip.tripEndedAt = now;
    trip.finalPrice = finalPrice;
    if (trip.paymentMethod === 'cash') {
      trip.paymentStatus = PaymentStatus.PAID;
    }

    // Update driver status back to online and increment trips
    await this.driverRepo.update(
      { userId: driverUserId },
      { status: DriverStatus.ONLINE },
    );

    // Increment totals
    const driver = await this.driverRepo.findOne({ where: { userId: driverUserId } });
    if (driver) {
      driver.totalTrips += 1;
      await this.driverRepo.save(driver);
    }
    const passenger = await this.passengerRepo.findOne({ where: { userId: trip.passengerId } });
    if (passenger) {
      passenger.totalTrips += 1;
      await this.passengerRepo.save(passenger);
    }

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(tripId, 'trip_completed', 'driver', driverUserId, { finalPrice });
    return saved;
  }

  async cancelTrip(tripId: string, userId: string, dto: CancelTripDto, role: string): Promise<Trip> {
    const trip = await this.findById(tripId);

    const cancellableStatuses = [
      TripStatus.BIDDING_OPEN,
      TripStatus.DRIVER_SELECTED,
      TripStatus.DRIVER_EN_ROUTE,
      TripStatus.DRIVER_ARRIVED,
    ];

    if (!cancellableStatuses.includes(trip.status)) {
      throw new BadRequestException('Trip cannot be cancelled in its current state');
    }

    if (role === 'passenger' && trip.passengerId !== userId) throw new ForbiddenException();
    if (role === 'driver' && trip.driverId !== userId) throw new ForbiddenException();

    trip.status = role === 'passenger' ? TripStatus.CANCELLED_BY_PASSENGER : TripStatus.CANCELLED_BY_DRIVER;
    trip.cancelledBy = userId;
    trip.cancellationReason = dto.reason || null;

    // Release driver if assigned
    if (trip.driverId) {
      await this.driverRepo.update({ userId: trip.driverId }, { status: DriverStatus.ONLINE });
    }

    // Expire any open bids
    await this.biddingService.expireBids(tripId);

    const saved = await this.tripRepo.save(trip);
    await this.logEvent(tripId, 'trip_cancelled', role, userId, { reason: dto.reason });
    return saved;
  }

  async getPassengerTrips(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.tripRepo.findAndCount({
      where: { passengerId: userId },
      relations: ['vehicleCategory', 'driver'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async getDriverTrips(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.tripRepo.findAndCount({
      where: { driverId: userId },
      relations: ['vehicleCategory', 'passenger'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findAll(page = 1, limit = 20, status?: TripStatus) {
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await this.tripRepo.findAndCount({
      where,
      relations: ['passenger', 'driver', 'vehicleCategory'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async getPriceEstimate(
    pickupLat: number, pickupLng: number,
    dropoffLat: number, dropoffLng: number,
    vehicleCategoryId: string,
  ) {
    const distanceM = this.geoService.calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const durationS = this.geoService.estimateEta(distanceM);
    return this.pricingService.calculatePrice(distanceM, durationS, vehicleCategoryId);
  }

  private async logEvent(
    tripId: string,
    type: string,
    actorType: string,
    actorId: string,
    metadata?: Record<string, any>,
  ) {
    const event = this.eventRepo.create({ tripId, type, actorType, actorId, metadata });
    await this.eventRepo.save(event);
  }
}
