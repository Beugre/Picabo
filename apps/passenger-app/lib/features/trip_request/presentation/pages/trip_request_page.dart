import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:passenger_app/core/theme/app_theme.dart';

class TripRequestPage extends StatefulWidget {
  const TripRequestPage({super.key});

  @override
  State<TripRequestPage> createState() => _TripRequestPageState();
}

class _TripRequestPageState extends State<TripRequestPage> {
  final _pickupController = TextEditingController();
  final _destinationController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _pickupController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  Future<void> _requestTrip() async {
    if (_pickupController.text.isEmpty || _destinationController.text.isEmpty) {
      return;
    }
    setState(() => _isLoading = true);
    // TODO: create trip request via bloc and get tripId
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isLoading = false);
      // Navigate to auction page with tripId from API response
      context.go('/trip/auction/demo-trip-id');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Demander un trajet')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Planifiez votre trajet',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _pickupController,
                decoration: const InputDecoration(
                  labelText: 'Point de départ',
                  prefixIcon: Icon(
                    Icons.my_location,
                    color: AppTheme.primaryColor,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _destinationController,
                decoration: const InputDecoration(
                  labelText: 'Destination',
                  prefixIcon: Icon(
                    Icons.location_on,
                    color: AppTheme.errorColor,
                  ),
                ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _requestTrip,
                icon: _isLoading
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.search),
                label: const Text('Rechercher des conducteurs'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
