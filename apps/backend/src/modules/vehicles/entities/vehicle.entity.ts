import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DriverProfile } from '../../drivers/entities/driver-profile.entity';
import { VehicleCategory } from './vehicle-category.entity';

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => DriverProfile)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => VehicleCategory)
  @JoinColumn({ name: 'category_id' })
  category: VehicleCategory;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ unique: true, name: 'plate_number' })
  plateNumber: string;

  @Column()
  year: number;

  @Column({ default: 4, name: 'seat_count' })
  seatCount: number;

  @Column({ nullable: true, name: 'photo_url' })
  photoUrl: string;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.PENDING })
  status: VehicleStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
