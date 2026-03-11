import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { Trip } from '../trips/entities/trip.entity';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Trip]),
    WalletsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
