import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Trip, TripStatus } from '../trips/entities/trip.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { PassengerProfile } from '../passengers/entities/passenger-profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    @InjectRepository(PassengerProfile) private passengerRepo: Repository<PassengerProfile>,
  ) {}

  async createReview(reviewerUserId: string, role: UserRole, dto: CreateReviewDto): Promise<Review> {
    const trip = await this.tripRepo.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== TripStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed trips');
    }

    let revieweeUserId: string;
    if (role === UserRole.PASSENGER) {
      if (trip.passengerId !== reviewerUserId) throw new BadRequestException('Not your trip');
      revieweeUserId = trip.driverId;
    } else {
      if (trip.driverId !== reviewerUserId) throw new BadRequestException('Not your trip');
      revieweeUserId = trip.passengerId;
    }

    const existing = await this.reviewRepo.findOne({
      where: { tripId: dto.tripId, reviewerUserId },
    });
    if (existing) throw new BadRequestException('Already reviewed this trip');

    const review = this.reviewRepo.create({
      tripId: dto.tripId,
      reviewerUserId,
      revieweeUserId,
      rating: dto.rating,
      comment: dto.comment,
    });
    const saved = await this.reviewRepo.save(review);

    // Update average rating
    await this.updateAverageRating(revieweeUserId, role === UserRole.PASSENGER ? 'driver' : 'passenger');

    return saved;
  }

  async getMyReviews(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.reviewRepo.findAndCount({
      where: { revieweeUserId: userId },
      relations: ['reviewer', 'trip'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  private async updateAverageRating(userId: string, profileType: 'driver' | 'passenger') {
    const avg = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .where('r.reviewee_user_id = :userId', { userId })
      .getRawOne();

    const avgRating = parseFloat(avg?.avg || '0');

    if (profileType === 'driver') {
      await this.driverRepo.update({ userId }, { ratingAvg: avgRating });
    } else {
      await this.passengerRepo.update({ userId }, { ratingAvg: avgRating });
    }
  }
}
