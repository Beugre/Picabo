import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('config')
export class AppConfigController {
  constructor(private readonly configService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: 'List all system configs' })
  findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get config by key' })
  findOne(@Param('key') key: string) {
    return this.configService.findByKey(key);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update or create config' })
  update(@Param('key') key: string, @Body() dto: UpdateConfigDto) {
    return this.configService.upsert(key, dto);
  }
}
