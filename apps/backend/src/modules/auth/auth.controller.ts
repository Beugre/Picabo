import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for phone number login' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and get tokens' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user.id);
  }

  @Patch('fcm-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateFcmToken(@CurrentUser() user: any, @Body() dto: UpdateFcmTokenDto) {
    return this.authService.updateFcmToken(user.id, dto.fcmToken);
  }
}
