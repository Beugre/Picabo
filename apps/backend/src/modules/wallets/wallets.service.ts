import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletTransaction, WalletTransactionType } from './entities/wallet-transaction.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletTransaction) private txRepo: Repository<WalletTransaction>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    private dataSource: DataSource,
  ) {}

  async getDriverWallet(userId: string) {
    const driver = await this.driverRepo.findOne({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found');

    const [transactions, total] = await this.txRepo.findAndCount({
      where: { driverId: driver.userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return {
      balance: driver.walletBalance,
      transactions,
      total,
    };
  }

  async creditDriver(driverUserId: string, amount: number, reference: string): Promise<WalletTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const driver = await manager.findOne(DriverProfile, { where: { userId: driverUserId } });
      if (!driver) throw new NotFoundException('Driver profile not found');

      const balanceBefore = Number(driver.walletBalance);
      const balanceAfter = balanceBefore + amount;

      driver.walletBalance = balanceAfter;
      await manager.save(driver);

      const tx = manager.create(WalletTransaction, {
        driverId: driver.userId,
        type: WalletTransactionType.CREDIT,
        amount,
        balanceBefore,
        balanceAfter,
        reference: reference || uuidv4(),
      });
      return manager.save(tx);
    });
  }

  async debitDriver(driverUserId: string, amount: number, reference: string): Promise<WalletTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const driver = await manager.findOne(DriverProfile, { where: { userId: driverUserId } });
      if (!driver) throw new NotFoundException('Driver profile not found');

      const balanceBefore = Number(driver.walletBalance);
      if (balanceBefore < amount) {
        throw new Error('Insufficient wallet balance');
      }
      const balanceAfter = balanceBefore - amount;

      driver.walletBalance = balanceAfter;
      await manager.save(driver);

      const tx = manager.create(WalletTransaction, {
        driverId: driver.userId,
        type: WalletTransactionType.DEBIT,
        amount,
        balanceBefore,
        balanceAfter,
        reference: reference || uuidv4(),
      });
      return manager.save(tx);
    });
  }
}
