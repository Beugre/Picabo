import 'package:equatable/equatable.dart';

enum DriverStatus { offline, online, busy }

class Driver extends Equatable {
  final String id;
  final String phone;
  final String? firstName;
  final String? lastName;
  final String? avatarUrl;
  final double rating;
  final int totalTrips;
  final DriverStatus status;
  final bool isVerified;
  final DateTime createdAt;

  const Driver({
    required this.id,
    required this.phone,
    this.firstName,
    this.lastName,
    this.avatarUrl,
    required this.rating,
    required this.totalTrips,
    required this.status,
    required this.isVerified,
    required this.createdAt,
  });

  String get fullName {
    if (firstName != null && lastName != null) {
      return '$firstName $lastName';
    }
    return firstName ?? lastName ?? phone;
  }

  @override
  List<Object?> get props =>
      [id, phone, status, isVerified, rating, totalTrips];
}
