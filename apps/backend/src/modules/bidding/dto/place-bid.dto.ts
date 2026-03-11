import { IsString, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceBidDto {
  @ApiProperty()
  @IsString()
  tripId: string;

  @ApiProperty({ example: 2500, description: 'Bid amount in XOF' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
