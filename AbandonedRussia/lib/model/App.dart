import 'package:algolia/algolia.dart';

import '../dao/Database.dart';

class AppUser {
  String uid;
  String name = 'Anonymous';
  DateTime registered;
  AppUser({this.uid, this.registered});
}

class App {
  static Algolia algolia;

  static Future<void> init() async {
    await Database.connect();

    algolia = Algolia.init(
      applicationId: '1:271567668146:web:53c6e2442acc933f841aab',
      apiKey: 'AIzaSyCeOty5zkBpof-Guh_28VBr_364F2IRzBI',
    );
  }

  static AppUser get currentUser => Database.currentUser;
}
