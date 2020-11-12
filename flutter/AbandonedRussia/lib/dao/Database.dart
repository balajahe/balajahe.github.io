import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart' as fba;

import '../model/User.dart';

class Database {
  static User _currentUser;

  static Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await fba.FirebaseAuth.instance.signInAnonymously();
    _currentUser = User(
      uid: fba.FirebaseAuth.instance.currentUser.uid,
      created: fba.FirebaseAuth.instance.currentUser.metadata.creationTime,
    );
  }

  static User get currentUser => _currentUser;
}
