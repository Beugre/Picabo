import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleCategory } from './entities/vehicle-category.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleCategory, DriverProfile])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
