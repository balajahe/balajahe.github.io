import '../dao/Database.dart';

class AppUser {
  String uid;
  String name = 'Anonymous';
  DateTime created;
  AppUser({this.uid, this.created});
}

class App {
  static Future<void> init() async {
    await Database.connect();
  }

  static AppUser get currentUser => Database.currentUser;
}
