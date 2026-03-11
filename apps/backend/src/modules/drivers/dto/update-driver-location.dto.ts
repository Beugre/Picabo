import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverLocationDto {
  @ApiProperty({ example: 5.3599 })
  @IsNumber()
  @Min(-90) @Max(90)
  lat: number;

  @ApiProperty({ example: -4.0083 })
  @IsNumber()
  @Min(-180) @Max(180)
  lng: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  heading?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  speed?: number;
}
