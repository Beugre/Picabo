import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from '../trips/entities/trip.entity';
import { DriverProfile, DriverStatus } from '../drivers/entities/driver-profile.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalTrips,
      completedTrips,
      activeDrivers,
      revenueToday,
      totalPassengers,
      totalDrivers,
    ] = await Promise.all([
      this.tripRepo.count(),
      this.tripRepo.count({ where: { status: TripStatus.COMPLETED } }),
      this.driverRepo.count({ where: { status: DriverStatus.ONLINE } }),
      this.tripRepo
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.final_price), 0)', 'total')
        .where('t.status = :status', { status: TripStatus.COMPLETED })
        .andWhere('t.trip_ended_at >= :today', { today })
        .getRawOne(),
      this.userRepo.count({ where: { role: UserRole.PASSENGER } }),
      this.userRepo.count({ where: { role: UserRole.DRIVER } }),
    ]);

    const conversionRate = totalTrips > 0
      ? Math.round((completedTrips / totalTrips) * 100)
      : 0;

    return {
      totalTrips,
      completedTrips,
      activeDrivers,
      revenueToday: parseFloat(revenueToday?.total || '0'),
      totalPassengers,
      totalDrivers,
      conversionRate,
    };
  }

  async getTripsPerDay(days = 7): Promise<Array<{ date: string; count: number }>> {
    const results = await this.tripRepo
      .createQueryBuilder('t')
      .select("DATE(t.created_at) as date, COUNT(*) as count")
      .where("t.created_at >= NOW() - INTERVAL ':days days'", { days })
      .groupBy('DATE(t.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map(r => ({ date: r.date, count: parseInt(r.count) }));
  }

  async getGmvPerDay(days = 7): Promise<Array<{ date: string; gmv: number }>> {
    const results = await this.tripRepo
      .createQueryBuilder('t')
      .select("DATE(t.trip_ended_at) as date, COALESCE(SUM(t.final_price), 0) as gmv")
      .where("t.status = :status", { status: TripStatus.COMPLETED })
      .andWhere("t.trip_ended_at >= NOW() - INTERVAL ':days days'", { days })
      .groupBy('DATE(t.trip_ended_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map(r => ({ date: r.date, gmv: parseFloat(r.gmv) }));
  }

  async getDriverStats() {
    const stats = await this.driverRepo
      .createQueryBuilder('d')
      .select([
        'COUNT(*) as total',
        "COUNT(CASE WHEN d.status = 'online' THEN 1 END) as online",
        "COUNT(CASE WHEN d.status = 'on_trip' THEN 1 END) as on_trip",
        "COUNT(CASE WHEN d.verification_status = 'approved' THEN 1 END) as approved",
        "COUNT(CASE WHEN d.verification_status = 'pending' THEN 1 END) as pending_verification",
      ])
      .getRawOne();

    return {
      total: parseInt(stats.total),
      online: parseInt(stats.online),
      onTrip: parseInt(stats.on_trip),
      approved: parseInt(stats.approved),
      pendingVerification: parseInt(stats.pending_verification),
    };
  }
}
