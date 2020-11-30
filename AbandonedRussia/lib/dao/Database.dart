import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/App.dart' show AppUser;

class Database {
  static AppUser _dbUser;

  static Future<dynamic> connect() async {
    if (_dbUser == null) {
      await Firebase.initializeApp();
      await FirebaseAuth.instance.signInAnonymously();
      await _loadUserInfo();
    }
  }

  static Future<void> _loadUserInfo() async {
    var userInfo = await FirebaseFirestore.instance
        .collection('Users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .get();

    _dbUser = AppUser(
      uid: FirebaseAuth.instance.currentUser.uid,
      registered: FirebaseAuth.instance.currentUser.metadata.creationTime,
      name: (userInfo.exists) ? userInfo.data()['name'] : null,
      meta: (userInfo.exists) ? userInfo.data()['meta'] : null,
    );
  }

  static AppUser get dbUser => _dbUser;

  static Future<void> setUserInfo({String name, String meta}) async {
    await FirebaseFirestore.instance
        .collection('Users')
        .doc(FirebaseAuth.instance.currentUser.uid)
        .set({'name': name, 'meta': meta});
    await _loadUserInfo();
  }
}
