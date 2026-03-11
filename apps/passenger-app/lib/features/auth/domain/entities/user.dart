import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String phone;
  final String? firstName;
  final String? lastName;
  final String? avatarUrl;
  final DateTime createdAt;

  const User({
    required this.id,
    required this.phone,
    this.firstName,
    this.lastName,
    this.avatarUrl,
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
      [id, phone, firstName, lastName, avatarUrl, createdAt];
}
