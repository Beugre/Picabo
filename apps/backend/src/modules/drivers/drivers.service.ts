import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile, DriverStatus, DriverVerificationStatus } from './entities/driver-profile.entity';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
  ) {}

  async getProfile(userId: string): Promise<DriverProfile> {
    const profile = await this.driverRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Driver profile not found');
    return profile;
  }

  async getProfileById(id: string): Promise<DriverProfile> {
    const profile = await this.driverRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Driver profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateDriverProfileDto): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, dto);
    return this.driverRepo.save(profile);
  }

  async goOnline(userId: string, lat?: number, lng?: number): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);

    if (profile.verificationStatus !== DriverVerificationStatus.APPROVED) {
      throw new BadRequestException('Driver must be approved before going online');
    }

    profile.status = DriverStatus.ONLINE;
    profile.onlineSince = new Date();
    if (lat !== undefined) profile.currentLat = lat;
    if (lng !== undefined) profile.currentLng = lng;
    profile.lastLocationAt = new Date();

    return this.driverRepo.save(profile);
  }

  async goOffline(userId: string): Promise<DriverProfile> {
    const profile = await this.getProfile(userId);
    profile.status = DriverStatus.OFFLINE;
    profile.onlineSince = null;
    return this.driverRepo.save(profile);
  }

  async updateLocation(userId: string, dto: UpdateDriverLocationDto): Promise<{ success: boolean }> {
    const profile = await this.getProfile(userId);
    profile.currentLat = dto.lat;
    profile.currentLng = dto.lng;
    if (dto.heading !== undefined) profile.heading = dto.heading;
    if (dto.speed !== undefined) profile.speed = dto.speed;
    profile.lastLocationAt = new Date();
    await this.driverRepo.save(profile);
    return { success: true };
  }

  async findAll(page = 1, limit = 20, verificationStatus?: DriverVerificationStatus) {
    const where: any = {};
    if (verificationStatus) where.verificationStatus = verificationStatus;

    const [data, total] = await this.driverRepo.findAndCount({
      where,
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async updateStatus(id: string, status: DriverVerificationStatus): Promise<DriverProfile> {
    const profile = await this.getProfileById(id);
    profile.verificationStatus = status;
    return this.driverRepo.save(profile);
  }

  async getEarnings(userId: string) {
    const profile = await this.getProfile(userId);
    return {
      walletBalance: profile.walletBalance,
      totalTrips: profile.totalTrips,
      ratingAvg: profile.ratingAvg,
      acceptRate: profile.acceptRate,
      cancelRate: profile.cancelRate,
    };
  }
}
