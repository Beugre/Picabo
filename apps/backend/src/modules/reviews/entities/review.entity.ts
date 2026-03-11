import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'reviewer_user_id' })
  reviewerUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_user_id' })
  reviewer: User;

  @Column({ name: 'reviewee_user_id' })
  revieweeUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewee_user_id' })
  reviewee: User;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
