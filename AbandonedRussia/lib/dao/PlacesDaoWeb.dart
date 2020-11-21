import 'dart:typed_data';

import '../model/Place.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoWeb extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) {
    return Future(() => null);
  }

  Future<void> addOrigins(Place place) async {
    throw 'WEB-версия не поддерживает добавление фотографий!';
  }

  Future<void> delOrigins(Place place) async {
    throw 'WEB-версия не поддерживает удаление фотографий!';
  }
}