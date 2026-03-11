import 'package:flutter/material.dart';
import 'package:passenger_app/core/theme/app_theme.dart';

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
            // Avatar section
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
              'Passager',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '+225 07 00 00 00 00',
              style: TextStyle(color: Colors.grey[600]),
            ),
            const SizedBox(height: 32),
            // Menu items
            _ProfileMenuItem(
              icon: Icons.edit_outlined,
              label: 'Modifier le profil',
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
              icon: Icons.language_outlined,
              label: 'Langue',
              onTap: () {},
              trailing: const Text('Français'),
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
