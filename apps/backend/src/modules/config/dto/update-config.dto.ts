import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConfigDto {
  value: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
