import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile, DriverStatus } from '../drivers/entities/driver-profile.entity';

export interface NearbyDriver {
  driverId: string;
  userId: string;
  lat: number;
  lng: number;
  distanceM: number;
  ratingAvg: number;
  totalTrips: number;
}

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
  ) {}

  /**
   * Find online drivers within radius using Haversine formula in SQL.
   * For production, use PostGIS: ST_DWithin with geography type.
   */
  async findNearbyDrivers(
    lat: number,
    lng: number,
    radiusMeters = 5000,
    categoryId?: string,
  ): Promise<NearbyDriver[]> {
    const earthRadiusM = 6371000;

    // Haversine in SQL — works without PostGIS
    const query = this.driverRepo
      .createQueryBuilder('d')
      .select([
        'd.id as "driverId"',
        'd.user_id as "userId"',
        'd.current_lat as lat',
        'd.current_lng as lng',
        'd.rating_avg as "ratingAvg"',
        'd.total_trips as "totalTrips"',
        `(${earthRadiusM} * acos(
          cos(radians(:lat)) * cos(radians(d.current_lat)) *
          cos(radians(d.current_lng) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(d.current_lat))
        )) as "distanceM"`,
      ])
      .where('d.status = :status', { status: DriverStatus.ONLINE })
      .andWhere('d.current_lat IS NOT NULL')
      .andWhere('d.current_lng IS NOT NULL')
      .having(
        `(${earthRadiusM} * acos(
          cos(radians(:lat)) * cos(radians(d.current_lat)) *
          cos(radians(d.current_lng) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(d.current_lat))
        )) <= :radius`,
      )
      .setParameters({ lat, lng, radius: radiusMeters })
      .orderBy('"distanceM"', 'ASC')
      .limit(20);

    const results = await query.getRawMany();
    return results.map(r => ({
      driverId: r.driverId,
      userId: r.userId,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lng),
      distanceM: Math.round(parseFloat(r.distanceM)),
      ratingAvg: parseFloat(r.ratingAvg),
      totalTrips: parseInt(r.totalTrips),
    }));
  }

  /**
   * Haversine distance between two coordinates (in meters).
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  /**
   * Estimate ETA in seconds based on distance and average speed.
   * Uses Abidjan average urban speed (~25 km/h).
   */
  estimateEta(distanceM: number, avgSpeedKmh = 25): number {
    return Math.round((distanceM / 1000 / avgSpeedKmh) * 3600);
  }
}
