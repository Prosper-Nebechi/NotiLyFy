import 'package:flutter/material.dart';
import 'package:notilificacion/config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class SuperadminScreen extends StatefulWidget {
  static const routeName = '/superadmin';
  const SuperadminScreen({super.key});

  @override
  State<SuperadminScreen> createState() => _SuperadminScreenState();
}

class _SuperadminScreenState extends State<SuperadminScreen> {
  String? _role;
  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  Future<void> _loadRole() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _role = prefs.getString('user_role');
    });
  }

  Future<void> _toggleShutdown() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');

    final url = Uri.parse('${appConfig.apiBaseUrl}/admin/shutdown/toggle');
    final resp = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (resp.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('"✅ System toggled successfully"')),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Failed: ${resp.body}')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Admin Dashboard")),
      body: ListView(
        padding: EdgeInsets.all(16.0),
        children: [
          ElevatedButton(onPressed: () => {}, child: Text("Manage Users")),
          ElevatedButton(onPressed: () => {}, child: Text("Send Mass Message")),
          ElevatedButton(onPressed: () => {}, child: Text("View System Logs")),
          if (_role == 'superadmin')
            ElevatedButton(
              onPressed: _toggleShutdown, //this is the shutdown function
              child: Text("⚠ Close Everything"),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            ),
        ],
      ),
    );
  }
}
