import 'package:driver_app/features/trip_offers/domain/entities/trip_offer.dart';

abstract class TripOffersRepository {
  Stream<TripOffer> watchIncomingOffers();
  Future<void> submitBid({
    required String tripId,
    required int amount,
  });
  Future<void> ignoreTripOffer(String tripId);
}
