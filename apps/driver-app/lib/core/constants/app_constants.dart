class AppConstants {
  AppConstants._();

  static const String appName = 'Picabo Driver';
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3000',
  );
  static const String wsUrl = String.fromEnvironment(
    'WS_URL',
    defaultValue: 'ws://10.0.2.2:3000',
  );

  // Storage keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String driverKey = 'driver_data';

  // Driver settings
  static const int bidTimeoutSeconds = 120;
  static const int otpTimeoutSeconds = 300;
  static const int locationUpdateIntervalMs = 3000;

  // Map settings
  static const double defaultLat = 5.3599517; // Abidjan
  static const double defaultLng = -4.0082563;
  static const double defaultZoom = 14.0;
}
