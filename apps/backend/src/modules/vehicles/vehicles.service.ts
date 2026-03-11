import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleCategory } from './entities/vehicle-category.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleCategory) private categoryRepo: Repository<VehicleCategory>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
  ) {}

  async create(userId: string, dto: CreateVehicleDto): Promise<Vehicle> {
    const driver = await this.driverRepo.findOne({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found');

    const vehicle = this.vehicleRepo.create({
      ...dto,
      driverId: driver.id,
    });
    return this.vehicleRepo.save(vehicle);
  }

  async findMyVehicles(userId: string): Promise<Vehicle[]> {
    const driver = await this.driverRepo.findOne({ where: { userId } });
    if (!driver) return [];
    return this.vehicleRepo.find({
      where: { driverId: driver.id },
      relations: ['category'],
    });
  }

  async update(id: string, userId: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id }, relations: ['driver'] });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.driver.userId !== userId) throw new ForbiddenException();

    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
  }

  async getCategories(): Promise<VehicleCategory[]> {
    return this.categoryRepo.find({ where: { enabled: true } });
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.vehicleRepo.findAndCount({
      relations: ['category', 'driver', 'driver.user'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
