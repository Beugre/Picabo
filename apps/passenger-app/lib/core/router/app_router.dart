import 'package:go_router/go_router.dart';
import 'package:passenger_app/features/auth/presentation/pages/splash_page.dart';
import 'package:passenger_app/features/auth/presentation/pages/phone_input_page.dart';
import 'package:passenger_app/features/auth/presentation/pages/otp_verification_page.dart';
import 'package:passenger_app/features/home/presentation/pages/home_page.dart';
import 'package:passenger_app/features/trip_request/presentation/pages/trip_request_page.dart';
import 'package:passenger_app/features/auction/presentation/pages/auction_page.dart';
import 'package:passenger_app/features/tracking/presentation/pages/tracking_page.dart';
import 'package:passenger_app/features/history/presentation/pages/history_page.dart';
import 'package:passenger_app/features/profile/presentation/pages/profile_page.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (_, __) => const SplashPage(),
      ),
      GoRoute(
        path: '/auth/phone',
        builder: (_, __) => const PhoneInputPage(),
      ),
      GoRoute(
        path: '/auth/otp',
        builder: (_, state) =>
            OtpVerificationPage(phone: state.extra as String),
      ),
      GoRoute(
        path: '/home',
        builder: (_, __) => const HomePage(),
      ),
      GoRoute(
        path: '/trip/request',
        builder: (_, __) => const TripRequestPage(),
      ),
      GoRoute(
        path: '/trip/auction/:tripId',
        builder: (_, state) =>
            AuctionPage(tripId: state.pathParameters['tripId']!),
      ),
      GoRoute(
        path: '/trip/tracking/:tripId',
        builder: (_, state) =>
            TrackingPage(tripId: state.pathParameters['tripId']!),
      ),
      GoRoute(
        path: '/history',
        builder: (_, __) => const HistoryPage(),
      ),
      GoRoute(
        path: '/profile',
        builder: (_, __) => const ProfilePage(),
      ),
    ],
  );
}
