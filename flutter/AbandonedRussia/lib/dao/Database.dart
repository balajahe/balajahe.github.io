import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../model/App.dart' show AppUser;

class Database {
  static AppUser _currentUser;

  static Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
    _currentUser = AppUser(
      uid: FirebaseAuth.instance.currentUser.uid,
      registered: FirebaseAuth.instance.currentUser.metadata.creationTime,
    );
  }

  static AppUser get currentUser => _currentUser;
}
