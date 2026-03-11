import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersController } from './passengers.controller';
import { PassengersService } from './passengers.service';
import { PassengerProfile } from './entities/passenger-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerProfile])],
  controllers: [PassengersController],
  providers: [PassengersService],
  exports: [PassengersService],
})
export class PassengersModule {}
