import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTransaction, DriverProfile])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
