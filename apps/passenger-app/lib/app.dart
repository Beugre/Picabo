import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:passenger_app/core/router/app_router.dart';
import 'package:passenger_app/core/theme/app_theme.dart';

class PicaboPassengerApp extends StatelessWidget {
  const PicaboPassengerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Picabo',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: AppRouter.router,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('fr', 'CI'),
        Locale('en', 'US'),
      ],
      locale: const Locale('fr', 'CI'),
    );
  }
}
