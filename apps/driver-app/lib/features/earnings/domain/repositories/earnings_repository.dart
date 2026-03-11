import 'package:driver_app/features/earnings/domain/entities/earnings_summary.dart';

abstract class EarningsRepository {
  Future<EarningsSummary> getTodayEarnings();
  Future<EarningsSummary> getWeeklyEarnings();
  Future<EarningsSummary> getMonthlyEarnings();
}
