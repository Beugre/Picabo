import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BiddingService } from './bidding.service';
import { PlaceBidDto } from './dto/place-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('bidding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bids')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @Post()
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Place a bid on a trip' })
  placeBid(@CurrentUser() user: any, @Body() dto: PlaceBidDto) {
    return this.biddingService.placeBid(user.id, dto);
  }

  @Get('trip/:tripId')
  @Roles(UserRole.PASSENGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get bids for a trip' })
  getBidsForTrip(@Param('tripId') tripId: string) {
    return this.biddingService.getBidsForTrip(tripId);
  }
}
