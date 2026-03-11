import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripBid, BidStatus } from './entities/trip-bid.entity';
import { Trip, TripStatus } from '../trips/entities/trip.entity';
import { DriverProfile, DriverStatus } from '../drivers/entities/driver-profile.entity';
import { PricingService } from '../pricing/pricing.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { PlaceBidDto } from './dto/place-bid.dto';

@Injectable()
export class BiddingService {
  constructor(
    @InjectRepository(TripBid) private bidRepo: Repository<TripBid>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    private pricingService: PricingService,
    private geoService: GeolocationService,
  ) {}

  async placeBid(driverUserId: string, dto: PlaceBidDto): Promise<TripBid> {
    const trip = await this.tripRepo.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.BIDDING_OPEN) {
      throw new BadRequestException('Trip is not accepting bids');
    }
    if (trip.biddingExpiresAt && new Date() > trip.biddingExpiresAt) {
      throw new BadRequestException('Bidding period has expired');
    }

    const driver = await this.driverRepo.findOne({ where: { userId: driverUserId } });
    if (!driver) throw new NotFoundException('Driver profile not found');
    if (driver.status !== DriverStatus.ONLINE) {
      throw new BadRequestException('Driver must be online to place bids');
    }

    // Validate bid amount
    if (trip.vehicleCategoryId) {
      const isValid = await this.pricingService.validateBidAmount(dto.amount, trip.vehicleCategoryId);
      if (!isValid) throw new BadRequestException('Bid amount is outside allowed range');
    }

    // Check for existing bid from this driver
    const existingBid = await this.bidRepo.findOne({
      where: { tripId: dto.tripId, driverId: driverUserId, status: BidStatus.PENDING },
    });
    if (existingBid) {
      existingBid.amount = dto.amount;
      existingBid.score = await this.calculateScore(existingBid, driver);
      return this.bidRepo.save(existingBid);
    }

    // Calculate distance and ETA to pickup
    let distanceToPickupM = 0;
    let etaSeconds = 300;
    if (driver.currentLat && driver.currentLng) {
      distanceToPickupM = this.geoService.calculateDistance(
        driver.currentLat,
        driver.currentLng,
        trip.pickupLat,
        trip.pickupLng,
      );
      etaSeconds = this.geoService.estimateEta(distanceToPickupM);
    }

    const bid = this.bidRepo.create({
      tripId: dto.tripId,
      driverId: driverUserId,
      amount: dto.amount,
      etaSeconds,
      distanceToPickupM,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 min to accept
    });

    bid.score = await this.calculateScore(bid, driver);
    return this.bidRepo.save(bid);
  }

  async getBidsForTrip(tripId: string): Promise<TripBid[]> {
    return this.bidRepo.find({
      where: { tripId, status: BidStatus.PENDING },
      relations: ['driver'],
      order: { score: 'DESC' },
    });
  }

  async getBidById(id: string): Promise<TripBid> {
    const bid = await this.bidRepo.findOne({ where: { id }, relations: ['driver'] });
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  async acceptBid(bidId: string, passengerUserId: string): Promise<TripBid> {
    const bid = await this.getBidById(bidId);
    const trip = await this.tripRepo.findOne({ where: { id: bid.tripId } });

    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.passengerId !== passengerUserId) throw new ForbiddenException();
    if (bid.status !== BidStatus.PENDING) throw new BadRequestException('Bid is no longer available');

    // Reject all other bids
    await this.bidRepo.update(
      { tripId: bid.tripId, status: BidStatus.PENDING },
      { status: BidStatus.REJECTED },
    );

    bid.status = BidStatus.ACCEPTED;
    return this.bidRepo.save(bid);
  }

  async expireBids(tripId: string): Promise<void> {
    await this.bidRepo.update(
      { tripId, status: BidStatus.PENDING },
      { status: BidStatus.EXPIRED },
    );
  }

  private async calculateScore(bid: TripBid, driver: DriverProfile): Promise<number> {
    // Score = (1/amount * 0.4) + (1/etaSeconds * 0.3) + (rating * 0.2) + (acceptRate * 0.1) - (cancelRate * 0.1)
    const amountScore = bid.amount > 0 ? (1 / Number(bid.amount)) * 100000 : 0;
    const etaScore = bid.etaSeconds > 0 ? (1 / bid.etaSeconds) * 10000 : 0;
    const ratingScore = Number(driver.ratingAvg) || 3;
    const acceptRateScore = Number(driver.acceptRate) / 100;
    const cancelRatePenalty = Number(driver.cancelRate) / 100;

    return (
      amountScore * 0.4 +
      etaScore * 0.3 +
      ratingScore * 0.2 +
      acceptRateScore * 0.1 -
      cancelRatePenalty * 0.1
    );
  }
}
