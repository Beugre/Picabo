import 'package:flutter/material.dart';
import 'package:driver_app/core/theme/app_theme.dart';

enum DocumentStatus { notUploaded, pending, approved, rejected }

class DocumentsPage extends StatelessWidget {
  const DocumentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mes Documents')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _DocumentCard(
            title: "Permis de conduire",
            subtitle: "Recto et verso",
            icon: Icons.credit_card,
            status: DocumentStatus.approved,
          ),
          SizedBox(height: 12),
          _DocumentCard(
            title: "Carte grise",
            subtitle: "Document d'immatriculation du véhicule",
            icon: Icons.article_outlined,
            status: DocumentStatus.pending,
          ),
          SizedBox(height: 12),
          _DocumentCard(
            title: "Assurance véhicule",
            subtitle: "Police d'assurance en cours de validité",
            icon: Icons.shield_outlined,
            status: DocumentStatus.notUploaded,
          ),
          SizedBox(height: 12),
          _DocumentCard(
            title: "Photo de profil",
            subtitle: "Photo récente, fond blanc",
            icon: Icons.person_outline,
            status: DocumentStatus.approved,
          ),
          SizedBox(height: 12),
          _DocumentCard(
            title: "Carte nationale d'identité",
            subtitle: "CNI ou passeport en cours de validité",
            icon: Icons.badge_outlined,
            status: DocumentStatus.rejected,
          ),
        ],
      ),
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final DocumentStatus status;

  const _DocumentCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.status,
  });

  Color get _statusColor {
    switch (status) {
      case DocumentStatus.approved:
        return AppTheme.primaryColor;
      case DocumentStatus.pending:
        return AppTheme.accentColor;
      case DocumentStatus.rejected:
        return AppTheme.errorColor;
      case DocumentStatus.notUploaded:
        return Colors.grey;
    }
  }

  String get _statusLabel {
    switch (status) {
      case DocumentStatus.approved:
        return 'Approuvé';
      case DocumentStatus.pending:
        return 'En attente';
      case DocumentStatus.rejected:
        return 'Rejeté';
      case DocumentStatus.notUploaded:
        return 'Non fourni';
    }
  }

  IconData get _statusIcon {
    switch (status) {
      case DocumentStatus.approved:
        return Icons.check_circle;
      case DocumentStatus.pending:
        return Icons.hourglass_empty;
      case DocumentStatus.rejected:
        return Icons.cancel;
      case DocumentStatus.notUploaded:
        return Icons.upload_file;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 6),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: _statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: _statusColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            children: [
              Icon(_statusIcon, color: _statusColor, size: 20),
              const SizedBox(height: 4),
              Text(
                _statusLabel,
                style: TextStyle(
                  fontSize: 10,
                  color: _statusColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
