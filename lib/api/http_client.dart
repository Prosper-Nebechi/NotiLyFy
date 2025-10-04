import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class HttpClient {
  static Future<Map<String, String>> _headers() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    final headers = {'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return headers;
  }

  static Future<http.Response> get(String url) async {
    final headers = await _headers();
    return http.get(Uri.parse(url), headers: headers);
  }

  static Future<http.Response> post(String url, String body) async {
    final headers = await _headers();
    return http.post(Uri.parse(url), headers: headers, body: body);
  }
}
