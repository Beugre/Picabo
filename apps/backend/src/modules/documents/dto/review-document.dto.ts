import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentStatus } from '../entities/driver-document.entity';

export class ReviewDocumentDto {
  @ApiProperty({ enum: DocumentStatus })
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
