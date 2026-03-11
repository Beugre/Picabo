import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VehicleCategory } from '../../vehicles/entities/vehicle-category.entity';

export enum TripStatus {
  DRAFT = 'draft',
  SEARCHING_DRIVER = 'searching_driver',
  BIDDING_OPEN = 'bidding_open',
  DRIVER_SELECTED = 'driver_selected',
  DRIVER_EN_ROUTE = 'driver_en_route',
  DRIVER_ARRIVED = 'driver_arrived',
  TRIP_IN_PROGRESS = 'trip_in_progress',
  COMPLETED = 'completed',
  CANCELLED_BY_PASSENGER = 'cancelled_by_passenger',
  CANCELLED_BY_DRIVER = 'cancelled_by_driver',
  EXPIRED = 'expired',
  DISPUTED = 'disputed',
}

export enum PaymentMethod {
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'passenger_id' })
  passengerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column({ nullable: true, name: 'driver_id' })
  driverId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.DRAFT })
  status: TripStatus;

  @Column({ type: 'decimal', precision: 10, scale: 7, name: 'pickup_lat' })
  pickupLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, name: 'pickup_lng' })
  pickupLng: number;

  @Column({ name: 'pickup_address' })
  pickupAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, name: 'dropoff_lat' })
  dropoffLat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, name: 'dropoff_lng' })
  dropoffLng: number;

  @Column({ name: 'dropoff_address' })
  dropoffAddress: string;

  @Column({ nullable: true, name: 'estimated_distance_m' })
  estimatedDistanceM: number;

  @Column({ nullable: true, name: 'estimated_duration_s' })
  estimatedDurationS: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'proposed_price' })
  proposedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'selected_price' })
  selectedPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'final_price' })
  finalPrice: number;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH, name: 'payment_method' })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING, name: 'payment_status' })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true, name: 'vehicle_category_id' })
  vehicleCategoryId: string;

  @ManyToOne(() => VehicleCategory, { nullable: true })
  @JoinColumn({ name: 'vehicle_category_id' })
  vehicleCategory: VehicleCategory;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true, name: 'trip_started_at' })
  tripStartedAt: Date;

  @Column({ nullable: true, name: 'trip_arrived_at' })
  tripArrivedAt: Date;

  @Column({ nullable: true, name: 'trip_ended_at' })
  tripEndedAt: Date;

  @Column({ nullable: true, name: 'cancelled_by' })
  cancelledBy: string;

  @Column({ nullable: true, name: 'cancellation_reason' })
  cancellationReason: string;

  @Column({ nullable: true, name: 'bidding_expires_at' })
  biddingExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
