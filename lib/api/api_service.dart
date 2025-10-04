import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = "http://localhost:4000";

  String? _token;
  String? _refreshToken;
  String? _role;

  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Future<void> _saveAuthData(
    String token,
    String refreshToken,
    String role,
  ) async {
    _token = token;
    _refreshToken = refreshToken;
    _role = role;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("token", token);
    await prefs.setString("refreshToken", refreshToken);
    await prefs.setString("role", role);
  }

  Future<void> loadAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString("token");
    _refreshToken = prefs.getString("refreshToken");
    _role = prefs.getString("role");
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse("$baseUrl/auth/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'];
      final refreshToken = data['refreshToken'];
      final role = data['role'];

      await _saveAuthData(token, refreshToken, role);

      return {"success": true, "role": role};
    } else {
      final data = jsonDecode(response.body);
      return {"success": false, "message": data["message"] ?? "Login failed"};
    }
  }

  Future<bool> _refreshTokenIfNeeded() async {
    if (_refreshToken == null) return false;

    final response = await http.post(
      Uri.parse("$baseUrl/auth/refresh"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"token": _refreshToken}),
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _token = data['token'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("token", _token!);
      return true;
    }
    return false;
  }

  Future<http.Response> get(String endpoint) async {
    final headers = {
      "Content-Type": "application/json",
      if (_token != null) "Authorization": "Bearer $_token",
    };
    var response = await http.get(
      Uri.parse("$baseUrl$endpoint"),
      headers: headers,
    );
    if (response.statusCode == 401) {
      final refreshed = await _refreshTokenIfNeeded();
      if (refreshed) {
        headers["Authorization"] = "Bearer $_token";
        response = await http.get(
          Uri.parse("$baseUrl$endpoint"),
          headers: headers,
        );
      }
    }
    return response;
  }

  Future<Map<String, dynamic>> sendNotification(
    String userId,
    String title,
    String body,
  ) async {
    final response = await http.post(
      Uri.parse("$baseUrl/notify"),
      headers: {
        "Content-Type": "application/json",
        if (_token != null) "Authorization": "Bearer $_token",
      },
      body: jsonEncode({"userId": userId, "title": title, "body": body}),
    );
    if (response.statusCode == 200) {
      return {"success": true};
    } else {
      return {
        "success": false,
        "message": jsonDecode(response.body)["message"],
      };
    }
  }

  String? get role => _role;
  String? get token => _token;
}
