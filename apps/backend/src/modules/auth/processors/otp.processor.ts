import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

@Processor('otp')
export class OtpProcessor {
  private readonly logger = new Logger(OtpProcessor.name);

  constructor(private configService: ConfigService) {}

  @Process('send-sms')
  async handleSendSms(job: Job<{ phone: string; code: string }>) {
    const { phone, code } = job.data;
    this.logger.log(`[OTP Processor] Sending OTP ${code} to ${phone}`);

    // In production, integrate Twilio or a local SMS provider (e.g., Infobip, Orange CI)
    // Example Twilio integration:
    // const twilioClient = require('twilio')(
    //   this.configService.get('TWILIO_ACCOUNT_SID'),
    //   this.configService.get('TWILIO_AUTH_TOKEN'),
    // );
    // await twilioClient.messages.create({
    //   body: `Votre code Picabo est: ${code}. Valide 5 minutes.`,
    //   from: this.configService.get('TWILIO_PHONE_NUMBER'),
    //   to: phone,
    // });

    this.logger.log(`OTP ${code} would be sent to ${phone}`);
    return { success: true };
  }
}
