import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PassengersService } from './passengers.service';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('passengers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('passenger')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Get('profile')
  @Roles(UserRole.PASSENGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get passenger profile' })
  getProfile(@CurrentUser() user: any) {
    return this.passengersService.getProfile(user.id);
  }

  @Patch('profile')
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Update passenger profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdatePassengerDto) {
    return this.passengersService.updateProfile(user.id, dto);
  }
}
