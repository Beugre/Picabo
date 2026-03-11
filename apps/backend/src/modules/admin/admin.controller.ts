import {
  Controller, Get, Patch, Body, Param, Query, UseGuards,
  ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateDriverVerificationDto } from './dto/update-driver-status.dto';
import { ReviewDocumentDto } from '../documents/dto/review-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { DriverVerificationStatus } from '../drivers/entities/driver-profile.entity';
import { TripStatus } from '../trips/entities/trip.entity';
import { DocumentStatus } from '../documents/entities/driver-document.entity';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Analytics overview' })
  getOverview() {
    return this.adminService.getAnalyticsOverview();
  }

  @Get('drivers')
  @ApiOperation({ summary: 'List all drivers with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'verificationStatus', required: false, enum: DriverVerificationStatus })
  getDrivers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('verificationStatus') verificationStatus?: DriverVerificationStatus,
  ) {
    return this.adminService.getDrivers(page, limit, verificationStatus);
  }

  @Patch('drivers/:id/verification')
  @ApiOperation({ summary: 'Update driver verification status' })
  updateDriverVerification(
    @Param('id') id: string,
    @Body() dto: UpdateDriverVerificationDto,
  ) {
    return this.adminService.updateDriverVerification(id, dto.verificationStatus);
  }

  @Get('passengers')
  @ApiOperation({ summary: 'List all passengers' })
  getPassengers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getPassengers(page, limit);
  }

  @Get('trips')
  @ApiOperation({ summary: 'List all trips with filters' })
  @ApiQuery({ name: 'status', required: false, enum: TripStatus })
  getTrips(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: TripStatus,
  ) {
    return this.adminService.getTrips(page, limit, status);
  }

  @Get('documents')
  @ApiOperation({ summary: 'List documents pending review' })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus })
  getDocuments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: DocumentStatus,
  ) {
    return this.adminService.getDocuments(page, limit, status);
  }

  @Patch('documents/:id/review')
  @ApiOperation({ summary: 'Review a document' })
  reviewDocument(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: ReviewDocumentDto,
  ) {
    return this.adminService.reviewDocument(id, user.id, dto);
  }
}
