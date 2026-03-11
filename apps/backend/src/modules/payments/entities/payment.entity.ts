import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';

export enum PaymentProviderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  provider: string;

  @Column()
  method: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'XOF' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentProviderStatus, default: PaymentProviderStatus.PENDING })
  status: PaymentProviderStatus;

  @Column({ nullable: true, name: 'external_ref' })
  externalRef: string;

  @Column({ nullable: true, name: 'paid_at' })
  paidAt: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'raw_payload' })
  rawPayload: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
