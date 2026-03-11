import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:driver_app/core/theme/app_theme.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _isOnline = false;

  void _toggleOnlineStatus() {
    setState(() => _isOnline = !_isOnline);
    // TODO: notify backend via socket
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Map placeholder — replaced by GoogleMap widget with live location
          Container(
            color: Colors.grey[200],
            child: const Center(
              child: Icon(Icons.map, size: 80, color: Colors.grey),
            ),
          ),
          // Top status bar
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: const [
                            BoxShadow(color: Colors.black12, blurRadius: 8),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _isOnline
                                    ? AppTheme.onlineColor
                                    : AppTheme.offlineColor,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _isOnline ? 'En ligne' : 'Hors ligne',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: _isOnline
                                    ? AppTheme.onlineColor
                                    : AppTheme.offlineColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    CircleAvatar(
                      backgroundColor: Colors.white,
                      child: IconButton(
                        icon: const Icon(Icons.person_outline),
                        onPressed: () => context.push('/profile'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Online toggle button
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 12,
                    offset: Offset(0, -4),
                  ),
                ],
              ),
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 40),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Aujourd\'hui',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/earnings'),
                        child: const Text('Voir les gains'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _StatCard(
                        label: 'Trajets',
                        value: '0',
                        icon: Icons.directions_car,
                      ),
                      const SizedBox(width: 12),
                      _StatCard(
                        label: 'Gains',
                        value: '0 FCFA',
                        icon: Icons.account_balance_wallet_outlined,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onTap: _toggleOnlineStatus,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isOnline
                            ? AppTheme.onlineColor
                            : AppTheme.offlineColor,
                        boxShadow: [
                          BoxShadow(
                            color: (_isOnline
                                    ? AppTheme.onlineColor
                                    : AppTheme.offlineColor)
                                .withOpacity(0.4),
                            blurRadius: 20,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          _isOnline ? 'EN LIGNE' : 'HORS\nLIGNE',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.backgroundColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppTheme.primaryColor, size: 20),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[600])),
                Text(
                  value,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
