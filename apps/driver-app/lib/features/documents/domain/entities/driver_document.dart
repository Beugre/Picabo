import 'package:equatable/equatable.dart';

enum DocumentType {
  driverLicense,
  vehicleRegistration,
  insurance,
  profilePhoto,
  nationalId,
}

enum DocumentStatus { notUploaded, pending, approved, rejected }

class DriverDocument extends Equatable {
  final String id;
  final String driverId;
  final DocumentType type;
  final DocumentStatus status;
  final String? fileUrl;
  final String? rejectionReason;
  final DateTime? uploadedAt;

  const DriverDocument({
    required this.id,
    required this.driverId,
    required this.type,
    required this.status,
    this.fileUrl,
    this.rejectionReason,
    this.uploadedAt,
  });

  @override
  List<Object?> get props => [id, driverId, type, status];
}
