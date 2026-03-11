import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:driver_app/app.dart';
import 'package:driver_app/core/di/injection.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  await configureDependencies();

  runApp(const PicaboDriverApp());
}
