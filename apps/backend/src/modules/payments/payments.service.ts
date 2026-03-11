import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentProviderStatus } from './entities/payment.entity';
import { Trip, PaymentStatus, TripStatus } from '../trips/entities/trip.entity';
import { WalletsService } from '../wallets/wallets.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    private configService: ConfigService,
    private walletsService: WalletsService,
  ) {}

  async initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<Payment> {
    const trip = await this.tripRepo.findOne({ where: { id: dto.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.passengerId !== userId) throw new BadRequestException('Unauthorized');
    if (trip.status !== TripStatus.COMPLETED) {
      throw new BadRequestException('Trip must be completed before payment');
    }

    const amount = trip.finalPrice || trip.selectedPrice || trip.proposedPrice;

    const payment = this.paymentRepo.create({
      tripId: dto.tripId,
      provider: dto.provider,
      method: dto.method,
      amount,
      currency: 'XOF',
      status: PaymentProviderStatus.PENDING,
    });

    if (dto.provider === 'cinetpay') {
      const result = await this.callCinetPay(payment, trip);
      payment.externalRef = result.paymentToken;
      payment.rawPayload = result;
    } else if (dto.provider === 'cash') {
      payment.status = PaymentProviderStatus.COMPLETED;
      payment.paidAt = new Date();
      await this.markTripPaid(trip.id);
      await this.creditDriver(trip.driverId, amount, trip.id);
    }

    return this.paymentRepo.save(payment);
  }

  async handleWebhook(payload: any): Promise<{ received: boolean }> {
    this.logger.log(`Payment webhook received: ${JSON.stringify(payload)}`);

    const { cpm_trans_id, cpm_result, cpm_amount } = payload;

    if (cpm_result === '00') {
      const payment = await this.paymentRepo.findOne({
        where: { externalRef: cpm_trans_id },
      });

      if (payment) {
        payment.status = PaymentProviderStatus.COMPLETED;
        payment.paidAt = new Date();
        payment.rawPayload = { ...payment.rawPayload, webhook: payload };
        await this.paymentRepo.save(payment);

        const trip = await this.tripRepo.findOne({ where: { id: payment.tripId } });
        if (trip) {
          await this.markTripPaid(trip.id);
          await this.creditDriver(trip.driverId, payment.amount, trip.id);
        }
      }
    }

    return { received: true };
  }

  async getPayment(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id }, relations: ['trip'] });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  private async callCinetPay(payment: Payment, trip: Trip): Promise<any> {
    // CinetPay integration stub
    // In production: POST to https://api-checkout.cinetpay.com/v2/payment
    this.logger.log(`[CinetPay STUB] Initiating payment for trip ${trip.id}, amount: ${payment.amount} XOF`);

    const paymentToken = uuidv4();
    return {
      paymentToken,
      paymentUrl: `https://checkout.cinetpay.com/payment/${paymentToken}`,
      message: 'Payment initialized (stub)',
    };
  }

  private async markTripPaid(tripId: string): Promise<void> {
    await this.tripRepo.update(tripId, { paymentStatus: PaymentStatus.PAID });
  }

  private async creditDriver(driverUserId: string, amount: number, tripId: string): Promise<void> {
    if (!driverUserId) return;
    try {
      // 20% commission to platform
      const commission = this.calculateCommission(Number(amount), 20);
      const driverEarning = Number(amount) - commission;
      await this.walletsService.creditDriver(driverUserId, driverEarning, `Trip ${tripId}`);
    } catch (err) {
      this.logger.error(`Failed to credit driver wallet: ${err.message}`);
    }
  }

  private calculateCommission(amount: number, percent: number): number {
    return Math.round((amount * percent) / 100);
  }
}
