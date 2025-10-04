// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi (nonso.earn@gmail.com)
// Project: notilificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

import 'package:flutter/material.dart';
import '../config.dart';
import 'login_screen.dart';
import 'dart:ui';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Icon(Icons.notifications_active, size: 96),
                  const SizedBox(height: 24),

                  //App Name
                  Text(
                    'NotiLiFy',
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),

                  const SizedBox(height: 12),

                  //Description
                  Text(
                    'Centralized notifications for your orders, invoices, and community.',
                    textAlign: TextAlign.center,
                  ),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pushNamed(LoginScreen.routeName);
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 14.0),
                        child: Text("Get Started"),
                      ),
                    ),
                  ),

                  SizedBox(height: 8),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pushNamed(LoginScreen.routeName);
                    },
                    child: Text("I already have an account"),
                  ),

                  SizedBox(height: 24),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Backend: ",
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      Flexible(
                        child: Text(
                          appConfig.apiBaseUrl,
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                          style: TextStyle(
                            fontFeatures: [FontFeature.tabularFigures()],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
