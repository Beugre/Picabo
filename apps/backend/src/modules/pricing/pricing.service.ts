import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleCategory } from '../vehicles/entities/vehicle-category.entity';

export interface PriceEstimate {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  distanceKm: number;
  durationMinutes: number;
}

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(VehicleCategory) private categoryRepo: Repository<VehicleCategory>,
  ) {}

  async calculatePrice(
    distanceM: number,
    durationS: number,
    categoryId: string,
  ): Promise<PriceEstimate> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new BadRequestException('Vehicle category not found');

    const distanceKm = distanceM / 1000;
    const durationMinutes = durationS / 60;

    const baseFare = Number(category.baseFare);
    const distanceFare = Number(category.perKm) * distanceKm;
    const timeFare = Number(category.perMinute) * durationMinutes;
    const suggestedPrice = Math.max(
      Number(category.minPrice),
      Math.min(Number(category.maxPrice), baseFare + distanceFare + timeFare),
    );

    // Allow ±20% range around suggested
    const minPrice = Math.max(Number(category.minPrice), suggestedPrice * 0.8);
    const maxPrice = Math.min(Number(category.maxPrice), suggestedPrice * 1.2);

    return {
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      suggestedPrice: Math.round(suggestedPrice),
      baseFare: Math.round(baseFare),
      distanceFare: Math.round(distanceFare),
      timeFare: Math.round(timeFare),
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMinutes: Math.round(durationMinutes),
    };
  }

  async validateBidAmount(amount: number, categoryId: string): Promise<boolean> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) return false;
    return amount >= Number(category.minPrice) && amount <= Number(category.maxPrice);
  }

  calculateCommission(amount: number, commissionPercent: number): number {
    return Math.round((amount * commissionPercent) / 100);
  }

  // Surge pricing based on demand (simple multiplier)
  applySurge(basePrice: number, surgeMultiplier: number): number {
    return Math.round(basePrice * surgeMultiplier);
  }
}
