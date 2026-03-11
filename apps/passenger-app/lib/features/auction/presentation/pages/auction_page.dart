import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:passenger_app/core/theme/app_theme.dart';

class AuctionPage extends StatelessWidget {
  final String tripId;

  const AuctionPage({super.key, required this.tripId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offres des conducteurs'),
        actions: [
          Chip(
            label: const Text('1:58', style: TextStyle(fontSize: 12)),
            avatar: const Icon(Icons.timer, size: 16),
            backgroundColor: AppTheme.accentColor.withOpacity(0.2),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Trip summary card
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(color: Colors.black12, blurRadius: 8),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.my_location, color: AppTheme.primaryColor),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Point de départ',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: AppTheme.errorColor),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Destination',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Driver bids list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 3,
              itemBuilder: (context, index) {
                return _DriverBidCard(
                  driverName: 'Conducteur ${index + 1}',
                  rating: 4.5 - index * 0.2,
                  price: 1500 + index * 200,
                  eta: 3 + index,
                  onAccept: () {
                    // TODO: accept bid via bloc
                    context.go('/trip/tracking/$tripId');
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _DriverBidCard extends StatelessWidget {
  final String driverName;
  final double rating;
  final int price;
  final int eta;
  final VoidCallback onAccept;

  const _DriverBidCard({
    required this.driverName,
    required this.rating,
    required this.price,
    required this.eta,
    required this.onAccept,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const CircleAvatar(
              radius: 24,
              child: Icon(Icons.person),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    driverName,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: AppTheme.accentColor),
                      const SizedBox(width: 4),
                      Text('$rating', style: const TextStyle(fontSize: 12)),
                      const SizedBox(width: 8),
                      const Icon(Icons.access_time, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('$eta min', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '$price FCFA',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: onAccept,
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(80, 36),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: const Text('Accepter'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
