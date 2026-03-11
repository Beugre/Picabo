import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:driver_app/core/theme/app_theme.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mon Profil')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Center(
              child: Stack(
                children: [
                  const CircleAvatar(
                    radius: 50,
                    child: Icon(Icons.person, size: 60),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      decoration: const BoxDecoration(
                        color: AppTheme.primaryColor,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.camera_alt,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Conducteur',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text('+225 07 00 00 00 00',
                style: TextStyle(color: Colors.grey[600])),
            const SizedBox(height: 8),
            // Rating summary
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.star, color: AppTheme.accentColor, size: 20),
                const SizedBox(width: 4),
                const Text(
                  '4.8',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(width: 8),
                Text('(124 avis)', style: TextStyle(color: Colors.grey[600])),
              ],
            ),
            const SizedBox(height: 32),
            _ProfileMenuItem(
              icon: Icons.edit_outlined,
              label: 'Modifier le profil',
              onTap: () {},
            ),
            _ProfileMenuItem(
              icon: Icons.description_outlined,
              label: 'Mes documents',
              onTap: () => context.push('/documents'),
            ),
            _ProfileMenuItem(
              icon: Icons.directions_car_outlined,
              label: 'Mon véhicule',
              onTap: () {},
            ),
            _ProfileMenuItem(
              icon: Icons.payment_outlined,
              label: 'Méthodes de paiement',
              onTap: () {},
            ),
            _ProfileMenuItem(
              icon: Icons.notifications_outlined,
              label: 'Notifications',
              onTap: () {},
            ),
            _ProfileMenuItem(
              icon: Icons.help_outline,
              label: 'Aide et support',
              onTap: () {},
            ),
            const SizedBox(height: 16),
            _ProfileMenuItem(
              icon: Icons.logout,
              label: 'Se déconnecter',
              onTap: () {
                // TODO: logout via bloc
              },
              color: AppTheme.errorColor,
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Widget? trailing;
  final Color? color;

  const _ProfileMenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.trailing,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: color ?? AppTheme.secondaryColor),
        title: Text(
          label,
          style: TextStyle(
            color: color ?? AppTheme.secondaryColor,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: trailing ?? const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
