import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DisputeStatus } from '../entities/dispute.entity';

export class ResolveDisputeDto {
  @ApiProperty({ enum: [DisputeStatus.RESOLVED, DisputeStatus.CLOSED] })
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @ApiProperty()
  @IsString()
  resolution: string;
}
