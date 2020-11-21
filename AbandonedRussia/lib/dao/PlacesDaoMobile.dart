import 'dart:typed_data';
import 'package:firebase_storage/firebase_storage.dart';

import '../model/Place.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoMobile extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) {
    return FirebaseStorage.instance.ref().child('photos/$url').getData(size);
  }

  Future<void> addOrigins(Place place) => Future.wait(
        place.photos.where((photo) => photo.origin != null).map((photo) =>
            FirebaseStorage.instance
                .ref()
                .child('photos/${place.id}/${photo.originUrl}')
                .putData(photo.origin)
                .asStream()
                .first),
        eagerError: true,
      );

  Future<void> delOrigins(Place place) async {
    try {
      await Future.wait(
        place.photos.where((photo) => photo.originUrl != null).map((photo) =>
            FirebaseStorage.instance
                .ref()
                .child('photos/${place.id}/${photo.originUrl}')
                .delete()),
        eagerError: false,
      );
    } catch (e) {
      print(e);
    }
  }
}
