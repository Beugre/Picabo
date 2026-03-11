import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { DriverProfile } from '../../drivers/entities/driver-profile.entity';

export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => DriverProfile)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;

  @Column({ type: 'enum', enum: WalletTransactionType })
  type: WalletTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance_before' })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance_after' })
  balanceAfter: number;

  @Column()
  reference: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
