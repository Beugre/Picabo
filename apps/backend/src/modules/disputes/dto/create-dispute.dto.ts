import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDisputeDto {
  @ApiProperty()
  @IsString()
  tripId: string;

  @ApiProperty({ example: 'overcharge', description: 'overcharge | no_show | reckless_driving | other' })
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  description: string;
}
