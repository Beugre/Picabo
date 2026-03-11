import { Injectable } from '@nestjs/common';
import { DriversService } from '../drivers/drivers.service';
import { PassengersService } from '../passengers/passengers.service';
import { TripsService } from '../trips/trips.service';
import { DocumentsService } from '../documents/documents.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { DriverVerificationStatus } from '../drivers/entities/driver-profile.entity';
import { ReviewDocumentDto } from '../documents/dto/review-document.dto';
import { TripStatus } from '../trips/entities/trip.entity';
import { DocumentStatus } from '../documents/entities/driver-document.entity';

@Injectable()
export class AdminService {
  constructor(
    private driversService: DriversService,
    private passengersService: PassengersService,
    private tripsService: TripsService,
    private documentsService: DocumentsService,
    private analyticsService: AnalyticsService,
  ) {}

  async getDrivers(page: number, limit: number, verificationStatus?: DriverVerificationStatus) {
    return this.driversService.findAll(page, limit, verificationStatus);
  }

  async updateDriverVerification(id: string, verificationStatus: DriverVerificationStatus) {
    return this.driversService.updateStatus(id, verificationStatus);
  }

  async getPassengers(page: number, limit: number) {
    return this.passengersService.findAll(page, limit);
  }

  async getTrips(page: number, limit: number, status?: TripStatus) {
    return this.tripsService.findAll(page, limit, status);
  }

  async getDocuments(page: number, limit: number, status?: DocumentStatus) {
    return this.documentsService.findAll(page, limit, status);
  }

  async reviewDocument(id: string, reviewerId: string, dto: ReviewDocumentDto) {
    return this.documentsService.review(id, reviewerId, dto);
  }

  async getAnalyticsOverview() {
    return this.analyticsService.getOverview();
  }
}
