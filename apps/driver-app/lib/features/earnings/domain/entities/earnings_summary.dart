import 'package:equatable/equatable.dart';

class EarningsSummary extends Equatable {
  final int totalEarnings;
  final int totalTrips;
  final double averageRating;
  final int onlineMinutes;

  const EarningsSummary({
    required this.totalEarnings,
    required this.totalTrips,
    required this.averageRating,
    required this.onlineMinutes,
  });

  @override
  List<Object?> get props =>
      [totalEarnings, totalTrips, averageRating, onlineMinutes];
}
