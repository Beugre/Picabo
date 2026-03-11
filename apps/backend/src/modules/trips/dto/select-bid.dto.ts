import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectBidDto {
  @ApiProperty()
  @IsString()
  bidId: string;
}
