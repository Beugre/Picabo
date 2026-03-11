import {
  Controller, Post, Get, Body, Param, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { CancelTripDto } from './dto/cancel-trip.dto';
import { SelectBidDto } from './dto/select-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Create a new trip request' })
  create(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(user.id, dto);
  }

  @Get('estimate')
  @ApiOperation({ summary: 'Get price estimate for a route' })
  @ApiQuery({ name: 'pickupLat', type: Number })
  @ApiQuery({ name: 'pickupLng', type: Number })
  @ApiQuery({ name: 'dropoffLat', type: Number })
  @ApiQuery({ name: 'dropoffLng', type: Number })
  @ApiQuery({ name: 'vehicleCategoryId', type: String })
  getEstimate(
    @Query('pickupLat') pickupLat: number,
    @Query('pickupLng') pickupLng: number,
    @Query('dropoffLat') dropoffLat: number,
    @Query('dropoffLng') dropoffLng: number,
    @Query('vehicleCategoryId') vehicleCategoryId: string,
  ) {
    return this.tripsService.getPriceEstimate(
      +pickupLat, +pickupLng, +dropoffLat, +dropoffLng, vehicleCategoryId,
    );
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my trips (passenger or driver)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMyTrips(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    if (user.role === UserRole.DRIVER) {
      return this.tripsService.getDriverTrips(user.id, page, limit);
    }
    return this.tripsService.getPassengerTrips(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Post(':id/select-bid')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PASSENGER)
  @ApiOperation({ summary: 'Accept a driver bid' })
  selectBid(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: SelectBidDto,
  ) {
    return this.tripsService.selectBid(id, user.id, dto);
  }

  @Post(':id/arrived')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Driver marks arrival at pickup' })
  arrived(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.driverArrived(id, user.id);
  }

  @Post(':id/start')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Start the trip' })
  start(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.startTrip(id, user.id);
  }

  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Complete the trip' })
  complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.completeTrip(id, user.id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel the trip' })
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CancelTripDto,
  ) {
    return this.tripsService.cancelTrip(id, user.id, dto, user.role);
  }
}
