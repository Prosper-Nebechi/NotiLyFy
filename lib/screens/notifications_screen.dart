//SPDX-License-Identifier: Apache-2.0
//Copyright (c) 2025 Prosper Nebechi
//Project notificacion
//Note: See LICENSE and NOTICE files for attribution/third-party credits.

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';

class NotificationsScreen extends StatefulWidget {
  static const routeName = '/notifications';
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<dynamic> _notifications = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
  }

  Future<void> _fetchNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');

      if (token == null) {
        setState(() {
          _error = "You are not logged in.";
          _loading = false;
        });
        return;
      }
      final url = Uri.parse('${appConfig.apiBaseUrl}/notifications');
      final resp = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        setState(() {
          _notifications = body['notificatons'] ?? [];
          _loading = false;
        });
      } else {
        setState(() {
          _error = "Failed to fetch notifications: ${resp.body}";
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = "Network error: $e";
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Notifications")),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : _error != null
          ? Center(
              child: Text(_error!, style: TextStyle(color: Colors.red)),
            )
          : _notifications.isEmpty
          ? Center(child: Text("No notifications found."))
          : ListView.builder(
              itemBuilder: (context, index) {
                final notif = _notifications[index];
                return ListTile(
                  title: Text(notif['title'] ?? "No title"),
                  subtitle: Text(notif['body'] ?? "No message"),
                  trailing: Icon(Icons.notifications),
                );
              },
              itemCount: _notifications.length,
            ),
    );
  }
}
