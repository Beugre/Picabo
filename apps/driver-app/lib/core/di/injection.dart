import 'package:get_it/get_it.dart';
import 'package:driver_app/core/network/api_client.dart';

final GetIt getIt = GetIt.instance;

Future<void> configureDependencies() async {
  // Core
  getIt.registerSingleton<ApiClient>(ApiClient());

  // Repositories & BLoCs are registered here as features are implemented
}
