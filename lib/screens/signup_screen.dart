// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Prosper Nebechi (nonso.earn@gmail.com)
// Project: notilificacion
// Purpose: Perfect notification system
// Note: See LICENSE and NOTICE files for attribution/third-party credits.

import 'package:flutter/material.dart';
import 'dart:convert';
import 'login_screen.dart';
import '../config.dart';
import 'package:http/http.dart' as http;

class SignupScreen extends StatefulWidget {
  static String routeName = '/signup';
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;

  // This runs when the user taps "Create Account"
  Future<void> _register() async {
    if (!_formKey.currentState!.validate())
      return; //This is to validate the field first

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final url = Uri.parse('${appConfig.apiBaseUrl}/auth/register');

    try {
      final resp = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": _nameController.text.trim(),
          "email": _emailController.text.trim(),
          "password": _passwordController.text.trim(),
        }),
      );

      if (resp.statusCode == 201 || resp.statusCode == 200) {
        //success: backend created user
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Registration successful!")),
        );
        //navigate back to login screen
        Navigator.of(context).pop();
      } else {
        //show server  error message if available
        final data = jsonDecode(resp.body);
        setState(() {
          _errorMessage =
              data['message'] ?? data['error'] ?? 'Registration failed';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Networl error: $e';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Sign Up")),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _nameController,
                  decoration: InputDecoration(labelText: "Full Name"),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Enter your name" : null,
                ),
                SizedBox(height: 12),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(labelText: "Email Address"),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) => value != null && value.contains('@')
                      ? null
                      : "Enter a valid email address",
                ),
                SizedBox(height: 20),
                TextFormField(
                  controller: _passwordController,
                  decoration: InputDecoration(labelText: "Password"),
                  obscureText: true,
                  validator: (value) => (value != null && value.length >= 6)
                      ? null
                      : "Password must be 6+ characters",
                ),
                SizedBox(height: 20),
                if (_errorMessage != null)
                  Text(_errorMessage!, style: TextStyle(color: Colors.red)),
                SizedBox(height: 20),
                _isLoading
                    ? CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: _register,
                        child: Text("Create Account"),
                      ),
                SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.of(
                      context,
                    ).pushReplacementNamed(LoginScreen.routeName);
                  },
                  child: Text("Already have an account? Login"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
