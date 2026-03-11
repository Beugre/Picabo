import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PassengersModule } from './modules/passengers/passengers.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { TripsModule } from './modules/trips/trips.module';
import { BiddingModule } from './modules/bidding/bidding.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AppConfigModule } from './modules/config/config.module';
import { StorageModule } from './modules/storage/storage.module';

import { User } from './modules/users/entities/user.entity';
import { PassengerProfile } from './modules/passengers/entities/passenger-profile.entity';
import { DriverProfile } from './modules/drivers/entities/driver-profile.entity';
import { Vehicle } from './modules/vehicles/entities/vehicle.entity';
import { VehicleCategory } from './modules/vehicles/entities/vehicle-category.entity';
import { DriverDocument } from './modules/documents/entities/driver-document.entity';
import { Trip } from './modules/trips/entities/trip.entity';
import { TripBid } from './modules/bidding/entities/trip-bid.entity';
import { TripEvent } from './modules/trips/entities/trip-event.entity';
import { Review } from './modules/reviews/entities/review.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { WalletTransaction } from './modules/wallets/entities/wallet-transaction.entity';
import { Dispute } from './modules/disputes/entities/dispute.entity';
import { SystemConfig } from './modules/config/entities/system-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USER', 'picabo'),
        password: config.get('DATABASE_PASSWORD', 'picabo_secret'),
        database: config.get('DATABASE_NAME', 'picabo'),
        entities: [
          User, PassengerProfile, DriverProfile, Vehicle, VehicleCategory,
          DriverDocument, Trip, TripBid, TripEvent, Review, Payment,
          WalletTransaction, Dispute, SystemConfig,
        ],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PassengersModule,
    DriversModule,
    VehiclesModule,
    DocumentsModule,
    TripsModule,
    BiddingModule,
    PricingModule,
    GeolocationModule,
    RealtimeModule,
    PaymentsModule,
    WalletsModule,
    NotificationsModule,
    ReviewsModule,
    DisputesModule,
    AdminModule,
    AnalyticsModule,
    AppConfigModule,
    StorageModule,
  ],
})
export class AppModule {}
