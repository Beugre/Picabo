import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import { TripEvent } from './entities/trip-event.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { PassengerProfile } from '../passengers/entities/passenger-profile.entity';
import { PricingModule } from '../pricing/pricing.module';
import { GeolocationModule } from '../geolocation/geolocation.module';
import { BiddingModule } from '../bidding/bidding.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, TripEvent, DriverProfile, PassengerProfile]),
    PricingModule,
    GeolocationModule,
    BiddingModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
