import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {}

  async sendPush(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<{ success: boolean }> {
    if (!fcmToken) return { success: false };

    // In production, use firebase-admin:
    // const message = { notification: { title, body }, data, token: fcmToken };
    // await admin.messaging().send(message);

    this.logger.log(`[Push] To: ${fcmToken.substring(0, 10)}... | ${title}: ${body}`);
    return { success: true };
  }

  async sendSms(phone: string, message: string): Promise<{ success: boolean }> {
    // In production, use Twilio or local SMS gateway
    this.logger.log(`[SMS] To: ${phone} | ${message}`);
    return { success: true };
  }

  async notifyNewBid(passengerFcmToken: string, driverName: string, amount: number) {
    return this.sendPush(
      passengerFcmToken,
      'Nouvelle offre reçue',
      `${driverName} propose ${amount.toLocaleString('fr-CI')} FCFA`,
      { type: 'new_bid', amount: String(amount) },
    );
  }

  async notifyBidAccepted(driverFcmToken: string, tripId: string) {
    return this.sendPush(
      driverFcmToken,
      'Offre acceptée!',
      'Votre offre a été acceptée. Rendez-vous au point de prise en charge.',
      { type: 'bid_accepted', tripId },
    );
  }

  async notifyDriverArrived(passengerFcmToken: string) {
    return this.sendPush(
      passengerFcmToken,
      'Chauffeur arrivé',
      'Votre chauffeur est arrivé au point de prise en charge.',
      { type: 'driver_arrived' },
    );
  }

  async notifyTripCompleted(passengerFcmToken: string, amount: number) {
    return this.sendPush(
      passengerFcmToken,
      'Trajet terminé',
      `Votre trajet est terminé. Montant: ${amount.toLocaleString('fr-CI')} FCFA`,
      { type: 'trip_completed', amount: String(amount) },
    );
  }
}
