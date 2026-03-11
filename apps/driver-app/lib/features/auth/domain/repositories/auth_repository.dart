import 'package:driver_app/features/auth/domain/entities/driver.dart';

abstract class AuthRepository {
  Future<void> sendOtp(String phone);
  Future<Driver> verifyOtp(String phone, String otp);
  Future<void> logout();
  Future<Driver?> getCurrentDriver();
  Future<String?> getAccessToken();
}
