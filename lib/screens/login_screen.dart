// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi (nonso.earn@gmail.com)
// Project: notificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:notilificacion/api/api_service.dart';
import 'package:notilificacion/screens/superadmin_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';
import 'signup_screen.dart';

class LoginScreen extends StatefulWidget {
  static const routeName = '/login';
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCt1 = TextEditingController();
  final _passCt1 = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    //Start loading state
    setState(() {
      _loading = true;
      _error = null;
    });
    final api = ApiService();
    final result = await api.login(_emailCt1.text.trim(), _passCt1.text);

    if (result["success"] == true) {
      final role = result["role"];

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Login Successful")));

      if (!mounted) return;

      if (role == "superadmin") {
        Navigator.of(context).pushReplacementNamed('/notifications');
      }
    } else {
      setState(() {
        _error = result["message"];
      });
    }
    setState(() {
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Column(
            children: [
              TextFormField(
                controller: _emailCt1,
                decoration: InputDecoration(labelText: 'Email'),
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: _passCt1,
                decoration: InputDecoration(labelText: 'Password'),
                obscureText: true,
              ),
              SizedBox(height: 18),
              if (_error != null)
                Text(_error!, style: TextStyle(color: Colors.red)),
              SizedBox(height: 10),
              _loading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(onPressed: _login, child: Text('Login')),
              SizedBox(height: 10),
              TextButton(
                onPressed: () =>
                    Navigator.of(context).pushNamed(SignupScreen.routeName),
                child: Text('Create account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
