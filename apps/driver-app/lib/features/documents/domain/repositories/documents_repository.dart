import 'dart:io';

import 'package:driver_app/features/documents/domain/entities/driver_document.dart';

abstract class DocumentsRepository {
  Future<List<DriverDocument>> getMyDocuments();
  Future<DriverDocument> uploadDocument({
    required DocumentType type,
    required File file,
  });
}
