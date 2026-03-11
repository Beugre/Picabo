import 'package:go_router/go_router.dart';
import 'package:driver_app/features/auth/presentation/pages/splash_page.dart';
import 'package:driver_app/features/auth/presentation/pages/phone_input_page.dart';
import 'package:driver_app/features/auth/presentation/pages/otp_verification_page.dart';
import 'package:driver_app/features/home/presentation/pages/home_page.dart';
import 'package:driver_app/features/trip_offers/presentation/pages/trip_offer_page.dart';
import 'package:driver_app/features/navigation/presentation/pages/navigation_page.dart';
import 'package:driver_app/features/earnings/presentation/pages/earnings_page.dart';
import 'package:driver_app/features/profile/presentation/pages/profile_page.dart';
import 'package:driver_app/features/documents/presentation/pages/documents_page.dart';

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
        path: '/trip/offer/:tripId',
        builder: (_, state) =>
            TripOfferPage(tripId: state.pathParameters['tripId']!),
      ),
      GoRoute(
        path: '/trip/navigation/:tripId',
        builder: (_, state) =>
            NavigationPage(tripId: state.pathParameters['tripId']!),
      ),
      GoRoute(
        path: '/earnings',
        builder: (_, __) => const EarningsPage(),
      ),
      GoRoute(
        path: '/profile',
        builder: (_, __) => const ProfilePage(),
      ),
      GoRoute(
        path: '/documents',
        builder: (_, __) => const DocumentsPage(),
      ),
    ],
  );
}
