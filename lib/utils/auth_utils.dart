import 'package:shared_preferences/shared_preferences.dart';

class AuthUtils {
  //This checks if the role from sharedPrefernces and returns null if no role is stored
  static Future<String?> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_role');
  }

  //Returns true if the stored role is "superadmin" (case sensitive).
  static Future<bool> isSuperAdmin() async {
    final role = await getUserRole();
    return role == 'superadmin';
  }
}
