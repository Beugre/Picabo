import 'package:equatable/equatable.dart';

class TripOffer extends Equatable {
  final String id;
  final String passengerId;
  final String passengerName;
  final double passengerRating;
  final double pickupLat;
  final double pickupLng;
  final double dropoffLat;
  final double dropoffLng;
  final String pickupAddress;
  final String dropoffAddress;
  final double distanceKm;
  final int estimatedMinutes;
  final DateTime expiresAt;

  const TripOffer({
    required this.id,
    required this.passengerId,
    required this.passengerName,
    required this.passengerRating,
    required this.pickupLat,
    required this.pickupLng,
    required this.dropoffLat,
    required this.dropoffLng,
    required this.pickupAddress,
    required this.dropoffAddress,
    required this.distanceKm,
    required this.estimatedMinutes,
    required this.expiresAt,
  });

  @override
  List<Object?> get props => [
        id,
        passengerId,
        pickupAddress,
        dropoffAddress,
        distanceKm,
        expiresAt,
      ];
}
