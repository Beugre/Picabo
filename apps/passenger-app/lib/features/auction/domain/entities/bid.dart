import 'package:equatable/equatable.dart';

class Bid extends Equatable {
  final String id;
  final String tripId;
  final String driverId;
  final String driverName;
  final String? driverAvatarUrl;
  final double driverRating;
  final int amount;
  final int etaMinutes;
  final DateTime createdAt;

  const Bid({
    required this.id,
    required this.tripId,
    required this.driverId,
    required this.driverName,
    this.driverAvatarUrl,
    required this.driverRating,
    required this.amount,
    required this.etaMinutes,
    required this.createdAt,
  });

  @override
  List<Object?> get props =>
      [id, tripId, driverId, amount, etaMinutes, createdAt];
}
