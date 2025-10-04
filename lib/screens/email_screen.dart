import "package:flutter/material.dart";
import '../api/email_api.dart';

class EmailScreen extends StatefulWidget {
  static const routeName = '/email';
  const EmailScreen({super.key});

  @override
  State<EmailScreen> createState() => _EmailScreenState();
}

class _EmailScreenState extends State<EmailScreen> {
  final _emailService = EmailApi();
  final _toController = TextEditingController();
  final _subjectController = TextEditingController();
  final _textController = TextEditingController();

  Future<void> _sendEmail() async {
    try {
      await _emailService.sendEmail(
        to: _toController.text,
        subject: _subjectController.text,
        text: _textController.text,
        html: "<p>${_textController.text}</p>",
      );
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Email queued successfully")));
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Email")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _toController,
              decoration: InputDecoration(labelText: "To"),
            ),
            TextField(
              controller: _subjectController,
              decoration: InputDecoration(labelText: "Subject"),
            ),
            TextField(
              controller: _textController,
              decoration: InputDecoration(labelText: "Text"),
              maxLines: 5,
            ),
            SizedBox(height: 20),
            ElevatedButton(onPressed: _sendEmail, child: Text("Send")),
          ],
        ),
      ),
    );
  }
}
