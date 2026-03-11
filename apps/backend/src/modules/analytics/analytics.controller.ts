import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get platform analytics overview' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('trips-per-day')
  @ApiOperation({ summary: 'Get trips per day' })
  getTripsPerDay(@Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number) {
    return this.analyticsService.getTripsPerDay(days);
  }

  @Get('gmv-per-day')
  @ApiOperation({ summary: 'Get GMV per day' })
  getGmvPerDay(@Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number) {
    return this.analyticsService.getGmvPerDay(days);
  }

  @Get('driver-stats')
  @ApiOperation({ summary: 'Get driver statistics' })
  getDriverStats() {
    return this.analyticsService.getDriverStats();
  }
}
