import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RequestOtpDto {
  @ApiProperty({ example: '+2250700000000' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
