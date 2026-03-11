import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('trip_bids')
export class TripBid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'eta_seconds' })
  etaSeconds: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'distance_to_pickup_m' })
  distanceToPickupM: number;

  @Column({ type: 'enum', enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: true, name: 'expires_at' })
  expiresAt: Date;
}
