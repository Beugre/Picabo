import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriverVerificationStatus } from '../../drivers/entities/driver-profile.entity';

export class UpdateDriverVerificationDto {
  @ApiProperty({ enum: DriverVerificationStatus })
  @IsEnum(DriverVerificationStatus)
  verificationStatus: DriverVerificationStatus;
}
