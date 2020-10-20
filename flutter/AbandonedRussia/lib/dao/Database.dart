import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

class Database {
  static Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
  }

  static String get currentUser {
    return FirebaseAuth.instance.currentUser.uid;
  }
}
