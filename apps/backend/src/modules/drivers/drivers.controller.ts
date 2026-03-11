import { Controller, Get, Patch, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('driver')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('profile')
  @Roles(UserRole.DRIVER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get driver profile' })
  getProfile(@CurrentUser() user: any) {
    return this.driversService.getProfile(user.id);
  }

  @Patch('profile')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update driver profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateDriverProfileDto) {
    return this.driversService.updateProfile(user.id, dto);
  }

  @Post('go-online')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Go online and start accepting trips' })
  goOnline(@CurrentUser() user: any, @Body() body: { lat?: number; lng?: number }) {
    return this.driversService.goOnline(user.id, body.lat, body.lng);
  }

  @Post('go-offline')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Go offline' })
  goOffline(@CurrentUser() user: any) {
    return this.driversService.goOffline(user.id);
  }

  @Post('location')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update current location' })
  updateLocation(@CurrentUser() user: any, @Body() dto: UpdateDriverLocationDto) {
    return this.driversService.updateLocation(user.id, dto);
  }

  @Get('earnings')
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get driver earnings and stats' })
  getEarnings(@CurrentUser() user: any) {
    return this.driversService.getEarnings(user.id);
  }
}
