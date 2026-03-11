import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ON_TRIP = 'on_trip',
}

export enum DriverVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('driver_profiles')
export class DriverProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: DriverStatus, default: DriverStatus.OFFLINE })
  status: DriverStatus;

  @Column({ type: 'enum', enum: DriverVerificationStatus, default: DriverVerificationStatus.PENDING, name: 'verification_status' })
  verificationStatus: DriverVerificationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, name: 'current_lat' })
  currentLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true, name: 'current_lng' })
  currentLng: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number;

  @Column({ nullable: true, name: 'last_location_at' })
  lastLocationAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0, name: 'rating_avg' })
  ratingAvg: number;

  @Column({ default: 0, name: 'total_trips' })
  totalTrips: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'cancel_rate' })
  cancelRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'accept_rate' })
  acceptRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'wallet_balance' })
  walletBalance: number;

  @Column({ nullable: true, name: 'online_since' })
  onlineSince: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
