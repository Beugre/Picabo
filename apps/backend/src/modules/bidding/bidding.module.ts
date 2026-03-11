import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { TripBid } from './entities/trip-bid.entity';
import { Trip } from '../trips/entities/trip.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { PricingModule } from '../pricing/pricing.module';
import { GeolocationModule } from '../geolocation/geolocation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripBid, Trip, DriverProfile]),
    PricingModule,
    GeolocationModule,
  ],
  controllers: [BiddingController],
  providers: [BiddingService],
  exports: [BiddingService],
})
export class BiddingModule {}
