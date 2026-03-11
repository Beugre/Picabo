import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'opened_by' })
  openedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'opened_by' })
  opener: User;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @Column({ nullable: true })
  resolution: string;

  @Column({ nullable: true, name: 'resolved_by' })
  resolvedBy: string;

  @Column({ nullable: true, name: 'resolved_at' })
  resolvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
