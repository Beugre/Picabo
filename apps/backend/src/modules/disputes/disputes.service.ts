import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { Trip, TripStatus } from '../trips/entities/trip.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute) private disputeRepo: Repository<Dispute>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
  ) {}

  async create(userId: string, dto: CreateDisputeDto): Promise<Dispute> {
    const trip = await this.tripRepo.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    const dispute = this.disputeRepo.create({
      tripId: dto.tripId,
      openedBy: userId,
      category: dto.category,
      description: dto.description,
    });

    // Mark trip as disputed
    await this.tripRepo.update(dto.tripId, { status: TripStatus.DISPUTED });

    return this.disputeRepo.save(dispute);
  }

  async resolve(id: string, resolvedBy: string, dto: ResolveDisputeDto): Promise<Dispute> {
    const dispute = await this.disputeRepo.findOne({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');

    dispute.status = dto.status;
    dispute.resolution = dto.resolution;
    dispute.resolvedBy = resolvedBy;
    dispute.resolvedAt = new Date();

    return this.disputeRepo.save(dispute);
  }

  async findAll(page = 1, limit = 20, status?: DisputeStatus) {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await this.disputeRepo.findAndCount({
      where,
      relations: ['trip', 'opener'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMine(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.disputeRepo.findAndCount({
      where: { openedBy: userId },
      relations: ['trip'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }
}
