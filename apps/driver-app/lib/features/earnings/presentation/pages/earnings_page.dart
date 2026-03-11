import 'package:flutter/material.dart';
import 'package:driver_app/core/theme/app_theme.dart';

class EarningsPage extends StatelessWidget {
  const EarningsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Mes Gains'),
          bottom: const TabBar(
            tabs: [
              Tab(text: "Aujourd'hui"),
              Tab(text: 'Cette semaine'),
              Tab(text: 'Ce mois'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _EarningsSummary(
              totalEarnings: 12500,
              totalTrips: 8,
              period: "Aujourd'hui",
            ),
            _EarningsSummary(
              totalEarnings: 78000,
              totalTrips: 52,
              period: 'Cette semaine',
            ),
            _EarningsSummary(
              totalEarnings: 320000,
              totalTrips: 210,
              period: 'Ce mois',
            ),
          ],
        ),
      ),
    );
  }
}

class _EarningsSummary extends StatelessWidget {
  final int totalEarnings;
  final int totalTrips;
  final String period;

  const _EarningsSummary({
    required this.totalEarnings,
    required this.totalTrips,
    required this.period,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Total card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.primaryColor, Color(0xFF007A3D)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                Text(
                  period,
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(height: 8),
                Text(
                  '$totalEarnings FCFA',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$totalTrips trajets effectués',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Détail des trajets',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Trip list placeholder
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 5,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              return _EarningTripTile(
                destination: 'Trajet ${index + 1}',
                date: '${index + 1} déc. 2024 — 10:${index * 10 + 10}',
                amount: (1200 + index * 300),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _EarningTripTile extends StatelessWidget {
  final String destination;
  final String date;
  final int amount;

  const _EarningTripTile({
    required this.destination,
    required this.date,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 4),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.directions_car,
              color: AppTheme.primaryColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  destination,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                Text(
                  date,
                  style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
          Text(
            '+$amount FCFA',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryColor,
            ),
          ),
        ],
      ),
    );
  }
}
