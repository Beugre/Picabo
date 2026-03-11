import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { PassengerProfile } from '../passengers/entities/passenger-profile.entity';
import { DriverProfile } from '../drivers/entities/driver-profile.entity';
import { OtpService } from './otp.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PassengerProfile) private passengerRepo: Repository<PassengerProfile>,
    @InjectRepository(DriverProfile) private driverRepo: Repository<DriverProfile>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  async requestOtp(dto: RequestOtpDto) {
    const { phone, role } = dto;

    let user = await this.userRepo.findOne({ where: { phone } });

    if (!user) {
      user = this.userRepo.create({
        phone,
        role: role || UserRole.PASSENGER,
        firstName: '',
        lastName: '',
        status: UserStatus.PENDING,
      });
      await this.userRepo.save(user);

      if (user.role === UserRole.PASSENGER) {
        const profile = this.passengerRepo.create({ userId: user.id });
        await this.passengerRepo.save(profile);
      } else if (user.role === UserRole.DRIVER) {
        const profile = this.driverRepo.create({ userId: user.id });
        await this.driverRepo.save(profile);
      }
    }

    await this.otpService.generateAndSendOtp(phone);

    return { message: 'OTP sent successfully', phone, expiresIn: 300 };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, code, firstName, lastName } = dto;

    const isValid = await this.otpService.verifyOtp(phone, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.userRepo.findOne({ where: { phone } });
    if (!user) throw new UnauthorizedException('User not found');

    if (firstName || lastName) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
    }
    if (user.status === UserStatus.PENDING && (user.firstName || user.lastName)) {
      user.status = UserStatus.ACTIVE;
    }
    await this.userRepo.save(user);

    const tokens = await this.generateTokens(user);
    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh_secret'),
      });
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user);
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    await this.userRepo.update(userId, { fcmToken });
    return { message: 'FCM token updated' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh_secret'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user as any;
    return sanitized;
  }
}
