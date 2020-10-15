import 'package:firebase_core/firebase_core.dart';

class PlacesDAO {
  static Future<FirebaseApp> init() => Firebase.initializeApp();
}
