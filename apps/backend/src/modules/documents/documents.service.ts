import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverDocument, DocumentStatus } from './entities/driver-document.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DriverDocument) private documentRepo: Repository<DriverDocument>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
  ) {}

  async create(userId: string, dto: CreateDocumentDto): Promise<DriverDocument> {
    const driver = await this.driverRepo.findOne({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found');

    const doc = this.documentRepo.create({
      driverId: driver.id,
      type: dto.type,
      fileUrl: dto.fileUrl,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    return this.documentRepo.save(doc);
  }

  async findMine(userId: string): Promise<DriverDocument[]> {
    const driver = await this.driverRepo.findOne({ where: { userId } });
    if (!driver) return [];
    return this.documentRepo.find({ where: { driverId: driver.id } });
  }

  async review(id: string, reviewerId: string, dto: ReviewDocumentDto): Promise<DriverDocument> {
    const doc = await this.documentRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    doc.status = dto.status;
    doc.reviewedBy = reviewerId;
    doc.reviewedAt = new Date();
    if (dto.rejectionReason) doc.rejectionReason = dto.rejectionReason;

    return this.documentRepo.save(doc);
  }

  async findAll(page = 1, limit = 20, status?: DocumentStatus) {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await this.documentRepo.findAndCount({
      where,
      relations: ['driver', 'driver.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }
}
