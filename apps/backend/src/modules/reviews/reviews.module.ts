import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Trip } from '../trips/entities/trip.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { PassengerProfile } from '../passengers/entities/passenger-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Trip, DriverProfile, PassengerProfile])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
