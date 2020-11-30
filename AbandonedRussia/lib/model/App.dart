import 'dart:convert';
import 'package:crypto/crypto.dart';

import '../dao/Database.dart';

class AppUser {
  final String uid;
  final DateTime registered;
  final String name;
  final String meta;
  AppUser({this.uid, this.registered, this.name, this.meta});

  String toString() =>
      registered.toString() + ((name != null) ? ' <$name>' : '');

  String metaHash() =>
      (meta != null) ? md5.convert(utf8.encode(meta)).toString() : null;
}

class App {
  static Future<void> init() async {
    await Database.connect();
  }

  static AppUser get appUser => Database.dbUser;

  static Future<void> setUserInfo({String name, String meta}) =>
      Database.setUserInfo(name: name, meta: meta);
}
