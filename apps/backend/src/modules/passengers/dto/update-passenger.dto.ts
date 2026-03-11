import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePassengerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultPaymentMethod?: string;
}
