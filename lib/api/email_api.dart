import 'dart:convert';
import 'package:http/http.dart' as http;

class EmailApi {
  final String baseUrl = "http://localhost:4000";

  Future<void> sendEmail({
    required String to,
    required String subject,
    required String text,
    required String html,
  }) async {
    //This sends email rewuest to backend
    final response = await http.post(
      Uri.parse("$baseUrl/email"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "to": to,
        "subject": subject,
        "text": text,
        "html": html,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception("Failed to send email");
    }
  }
}
