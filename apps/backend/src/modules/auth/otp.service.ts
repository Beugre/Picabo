import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

const otpStore = new Map<string, { code: string; expiresAt: Date; attempts: number }>();

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private configService: ConfigService,
    @InjectQueue('otp') private otpQueue: Queue,
  ) {}

  async generateAndSendOtp(phone: string): Promise<string> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    otpStore.set(phone, { code, expiresAt, attempts: 0 });

    await this.otpQueue.add('send-sms', { phone, code }, { attempts: 3, backoff: 2000 });

    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    return code;
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const stored = otpStore.get(phone);
    if (!stored) return false;

    if (new Date() > stored.expiresAt) {
      otpStore.delete(phone);
      return false;
    }

    stored.attempts += 1;
    if (stored.attempts > 5) {
      otpStore.delete(phone);
      return false;
    }

    if (stored.code !== code) return false;

    otpStore.delete(phone);
    return true;
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
