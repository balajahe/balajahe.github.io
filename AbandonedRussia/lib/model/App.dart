import '../dao/Database.dart';

class AppUser {
  String uid;
  String name = 'Anonymous';
  DateTime registered;
  AppUser({this.uid, this.registered});
}

class App {
  static Future<void> init() async {
    await Database.connect();
  }

  static AppUser get currentUser => Database.currentUser;
}
