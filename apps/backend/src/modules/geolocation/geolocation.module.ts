import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeolocationService } from './geolocation.service';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfile])],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
