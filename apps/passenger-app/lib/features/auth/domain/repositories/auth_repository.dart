import 'package:passenger_app/features/auth/domain/entities/user.dart';

abstract class AuthRepository {
  Future<void> sendOtp(String phone);
  Future<User> verifyOtp(String phone, String otp);
  Future<void> logout();
  Future<User?> getCurrentUser();
  Future<String?> getAccessToken();
}
