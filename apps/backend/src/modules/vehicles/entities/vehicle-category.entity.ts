import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vehicle_categories')
export class VehicleCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'min_price' })
  minPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'max_price' })
  maxPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'base_fare' })
  baseFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'per_km' })
  perKm: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'per_minute' })
  perMinute: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20, name: 'commission_percent' })
  commissionPercent: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true, name: 'icon_url' })
  iconUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
