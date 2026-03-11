import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DriversModule } from '../drivers/drivers.module';
import { PassengersModule } from '../passengers/passengers.module';
import { TripsModule } from '../trips/trips.module';
import { DocumentsModule } from '../documents/documents.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    DriversModule,
    PassengersModule,
    TripsModule,
    DocumentsModule,
    AnalyticsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
