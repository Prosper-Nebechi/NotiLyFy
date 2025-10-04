import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';

class PreferencesScreen extends StatefulWidget {
  static const routeName = '/preferences';
  const PreferencesScreen({super.key});

  @override
  State<PreferencesScreen> createState() => _PreferencesScreenState();
}

class _PreferencesScreenState extends State<PreferencesScreen> {
  bool? _emailNotifications;
  bool? _pushNotifications;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  //Fetches preferences from backend: GET /preferences
  Future<void> _loadPreferences() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      if (token == null) {
        setState(() {
          _error = "Not logged in";
          _loading = false;
        });
        return;
      }

      final url = Uri.parse('${appConfig.apiBaseUrl}/preferences');
      final resp = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        //Expected response: { emailNotifications: true, pushNotifications: false }
        setState(() {
          _emailNotifications = body['emailNotifications'] as bool? ?? true;
          _pushNotifications = body['pushNotifications'] as bool? ?? true;
          _loading = false;
        });
      } else if (resp.statusCode == 404) {
        //user has no saved prefs -> use defaults
        setState(() {
          _emailNotifications = true;
          _pushNotifications = true;
          _loading = false;
        });
      } else {
        setState(() {
          _error = "Failed to fetch preferences: ${resp.body}";
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

  //Update preferences (PATCH or PUT to /preferences)
  Future<void> _updatePreferences() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      if (token == null) {
        setState(() {
          _error = "Not logged in";
          _loading = false;
        });
        return;
      }
      final url = Uri.parse('${appConfig.apiBaseUrl}/preferences');
      final resp = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authoriztion': 'Bearer $token',
        },
        body: jsonEncode({
          'emailNotifications': _emailNotifications ?? true,
          'pushNotifications': _pushNotifications ?? true,
        }),
      );
      if (resp.statusCode == 200) {
        if (!mounted) return;
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text("Preferences updated.")));
      } else {
        setState(() {
          _error = "Failed to update preferences: ${resp.body}";
        });
      }
    } catch (e) {
      setState(() {
        _error = "Network error: $e";
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Notification Preferences")),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: EdgeInsets.all(16.0),
              child: Column(
                children: [
                  if (_error != null) ...[
                    Text(_error!, style: TextStyle(color: Colors.red)),
                    SizedBox(height: 12),
                  ],
                  SwitchListTile(
                    value: _emailNotifications ?? true,
                    title: Text("Email notifications"),
                    onChanged: (v) {
                      setState(() => _emailNotifications = v);
                    },
                  ),
                  SwitchListTile(
                    value: _pushNotifications ?? true,
                    onChanged: (v) {
                      setState(() => _pushNotifications = v);
                    },
                  ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _updatePreferences,
                    child: Text("Save Preferences"),
                  ),
                ],
              ),
            ),
    );
  }
}
