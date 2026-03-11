import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingService } from './pricing.service';
import { VehicleCategory } from '../vehicles/entities/vehicle-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleCategory])],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
