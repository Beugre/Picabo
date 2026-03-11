import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:driver_app/core/theme/app_theme.dart';

class TripOfferPage extends StatefulWidget {
  final String tripId;

  const TripOfferPage({super.key, required this.tripId});

  @override
  State<TripOfferPage> createState() => _TripOfferPageState();
}

class _TripOfferPageState extends State<TripOfferPage>
    with SingleTickerProviderStateMixin {
  late AnimationController _timerController;
  final _bidController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _timerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 30),
    )..forward();
  }

  @override
  void dispose() {
    _timerController.dispose();
    _bidController.dispose();
    super.dispose();
  }

  Future<void> _submitBid() async {
    final amount = int.tryParse(_bidController.text);
    if (amount == null || amount <= 0) return;
    // TODO: submit bid via bloc
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Offre envoyée !')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle demande de trajet'),
        backgroundColor: AppTheme.accentColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Timer bar
            AnimatedBuilder(
              animation: _timerController,
              builder: (_, __) => LinearProgressIndicator(
                value: 1 - _timerController.value,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(
                  _timerController.value < 0.7
                      ? AppTheme.primaryColor
                      : AppTheme.errorColor,
                ),
                borderRadius: BorderRadius.circular(4),
                minHeight: 8,
              ),
            ),
            const SizedBox(height: 24),
            // Trip details card
            Container(
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
                  _LocationRow(
                    icon: Icons.my_location,
                    color: AppTheme.primaryColor,
                    label: 'Départ',
                    address: 'Plateau, Abidjan',
                  ),
                  const Divider(height: 20),
                  _LocationRow(
                    icon: Icons.location_on,
                    color: AppTheme.errorColor,
                    label: 'Arrivée',
                    address: 'Cocody, Abidjan',
                  ),
                  const Divider(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _InfoChip(
                        icon: Icons.straighten,
                        label: '8.2 km',
                      ),
                      _InfoChip(
                        icon: Icons.timer,
                        label: '~18 min',
                      ),
                      _InfoChip(
                        icon: Icons.person,
                        label: '1 passager',
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Votre offre de prix',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _bidController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Montant (FCFA)',
                suffixText: 'FCFA',
              ),
            ),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => context.pop(),
                    child: const Text('Ignorer'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _submitBid,
                    child: const Text('Envoyer l\'offre'),
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

class _LocationRow extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String address;

  const _LocationRow({
    required this.icon,
    required this.color,
    required this.label,
    required this.address,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 11, color: Colors.grey[500]),
            ),
            Text(
              address,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ],
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 4),
        Text(label, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
      ],
    );
  }
}
