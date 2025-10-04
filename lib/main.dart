// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi (nonso.earn@gmail.com)
// Project: notilificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

import 'package:flutter/material.dart';
import 'package:notilificacion/screens/email_screen.dart';
import 'package:notilificacion/screens/notifications_screen.dart';
import 'package:notilificacion/screens/preferences_screen.dart';
import 'package:notilificacion/screens/signup_screen.dart';
import 'package:notilificacion/screens/superadmin_screen.dart';
import 'package:notilificacion/screens/welcome_screen.dart';
import 'package:notilificacion/utils/auth_utils.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const Notilificacion());
}

class Notilificacion extends StatelessWidget {
  const Notilificacion({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "notilificacion",
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
        useMaterial3: true,
        textTheme: const TextTheme(
          headlineLarge: TextStyle(fontWeight: FontWeight.w700),
          bodyMedium: TextStyle(height: 1.3),
        ),
      ),
      home: WelcomeScreen(),

      routes: {
        //This is to make it more secure
        SuperadminScreen.routeName: (_) => FutureBuilder<bool>(
          future: AuthUtils.isSuperAdmin(),
          builder: (context, snapshot) {
            if (!snapshot.hasData)
              return const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              );
            if (snapshot.data == true) return const SuperadminScreen();
            return const Scaffold(body: Center(child: Text("Access Denied")));
          },
        ),
        LoginScreen.routeName: (_) => LoginScreen(),
        SignupScreen.routeName: (_) => SignupScreen(),
        NotificationsScreen.routeName: (_) => NotificationsScreen(),
        PreferencesScreen.routeName: (_) => PreferencesScreen(),
        EmailScreen.routeName: (_) => EmailScreen(),
      },
    );
  }
}
