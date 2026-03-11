import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('passenger_profiles')
export class PassengerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, name: 'default_payment_method' })
  defaultPaymentMethod: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0, name: 'rating_avg' })
  ratingAvg: number;

  @Column({ default: 0, name: 'total_trips' })
  totalTrips: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
