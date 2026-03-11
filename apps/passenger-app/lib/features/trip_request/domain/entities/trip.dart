import 'package:equatable/equatable.dart';

enum TripStatus {
  pending,
  auctionOpen,
  driverAssigned,
  driverEnRoute,
  driverArrived,
  inProgress,
  completed,
  cancelled,
}

class LatLng extends Equatable {
  final double latitude;
  final double longitude;

  const LatLng({required this.latitude, required this.longitude});

  @override
  List<Object?> get props => [latitude, longitude];
}

class Trip extends Equatable {
  final String id;
  final LatLng pickupLocation;
  final LatLng dropoffLocation;
  final String pickupAddress;
  final String dropoffAddress;
  final TripStatus status;
  final int? acceptedPrice;
  final String? driverId;
  final DateTime createdAt;

  const Trip({
    required this.id,
    required this.pickupLocation,
    required this.dropoffLocation,
    required this.pickupAddress,
    required this.dropoffAddress,
    required this.status,
    this.acceptedPrice,
    this.driverId,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        pickupLocation,
        dropoffLocation,
        status,
        acceptedPrice,
        driverId,
        createdAt,
      ];
}
