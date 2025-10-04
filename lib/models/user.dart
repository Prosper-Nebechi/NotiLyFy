import 'package:flutter/foundation.dart';

class User {
  final String id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});

  //Factory to create user from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: (json['_id'] ?? json['userId'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
    );
  }

  //convert User to JSON (For sending to backend)
  Map<String, dynamic> toJson() {
    return {"id": id, "name": name, "email": email};
  }
}
