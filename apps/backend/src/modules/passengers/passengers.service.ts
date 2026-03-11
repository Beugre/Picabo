import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerProfile } from './entities/passenger-profile.entity';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(PassengerProfile) private passengerRepo: Repository<PassengerProfile>,
  ) {}

  async getProfile(userId: string): Promise<PassengerProfile> {
    const profile = await this.passengerRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Passenger profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdatePassengerDto): Promise<PassengerProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, dto);
    return this.passengerRepo.save(profile);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.passengerRepo.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }
}
