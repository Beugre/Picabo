import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentProvider {
  CINETPAY = 'cinetpay',
  CASH = 'cash',
  ORANGE_MONEY = 'orange_money',
  MTN_MONEY = 'mtn_money',
  WAVE = 'wave',
}

export class InitiatePaymentDto {
  @ApiProperty()
  @IsString()
  tripId: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty()
  @IsString()
  method: string;
}
