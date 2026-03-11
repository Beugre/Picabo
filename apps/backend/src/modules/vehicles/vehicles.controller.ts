import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get available vehicle categories' })
  getCategories() {
    return this.vehiclesService.getCategories();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Register a vehicle' })
  create(@CurrentUser() user: any, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Get my vehicles' })
  getMyVehicles(@CurrentUser() user: any) {
    return this.vehiclesService.findMyVehicles(user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DRIVER)
  @ApiOperation({ summary: 'Update a vehicle' })
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, user.id, dto);
  }
}
