import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/trip.entity';

export class CreateTripDto {
  @ApiProperty({ example: 5.3599 })
  @IsNumber()
  @Min(-90) @Max(90)
  pickupLat: number;

  @ApiProperty({ example: -4.0083 })
  @IsNumber()
  @Min(-180) @Max(180)
  pickupLng: number;

  @ApiProperty({ example: 'Cocody, Abidjan' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: 5.3454 })
  @IsNumber()
  @Min(-90) @Max(90)
  dropoffLat: number;

  @ApiProperty({ example: -4.0163 })
  @IsNumber()
  @Min(-180) @Max(180)
  dropoffLng: number;

  @ApiProperty({ example: 'Plateau, Abidjan' })
  @IsString()
  dropoffAddress: string;

  @ApiProperty()
  @IsString()
  vehicleCategoryId: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
