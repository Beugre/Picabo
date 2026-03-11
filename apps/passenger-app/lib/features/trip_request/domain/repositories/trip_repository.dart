import 'package:passenger_app/features/trip_request/domain/entities/trip.dart';

abstract class TripRepository {
  Future<Trip> createTripRequest({
    required LatLng pickup,
    required LatLng dropoff,
    required String pickupAddress,
    required String dropoffAddress,
  });

  Future<Trip> getTripById(String tripId);
  Future<List<Trip>> getTripHistory({int page = 1, int limit = 20});
  Future<void> cancelTrip(String tripId);
}
