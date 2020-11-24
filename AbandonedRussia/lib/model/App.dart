import '../dao/Database.dart';

class AppUser {
  final String uid;
  final String name;
  final DateTime registered;
  AppUser({this.uid, this.name, this.registered});

  String toString() =>
      registered.toString() + ((name != null) ? ' <$name>' : '');
}

class App {
  static Future<void> init() async {
    await Database.connect();
  }

  static AppUser get appUser => Database.dbUser;

  static Future<void> setUserInfo({String name}) =>
      Database.setUserInfo(name: name);
}
