import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoMobile extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) =>
      FirebaseStorage.instance.ref().child(url).getData(size);

  Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();
    place.photos.forEach((photo) {
      if (photo.originUrl == null)
        photo.originUrl = 'photos/${Timestamp.now()}.png';
    });

    var addedPlace =
        await FirebaseFirestore.instance.collection('Places').add(toMap(place));
    place.id = addedPlace.id;

    await _addOrigins(place);

    return place;
  }

  Future<void> put(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .set(toMap(place));

    await _addOrigins(place);
  }

  Future<void> del(Place place) async {
    await _delOrigins(place);

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }

  Future<void> _addOrigins(Place place) => Future.wait(place.photos
      .where((photo) => photo.origin != null)
      .map((photo) => FirebaseStorage.instance
          .ref()
          .child(photo.originUrl)
          .putData(photo.origin)
          .onComplete));

  Future<void> _delOrigins(Place place) => Future.wait(place.photos
      .where((photo) => photo.originUrl != null)
      .map((photo) =>
          FirebaseStorage.instance.ref().child(photo.originUrl).delete()));

  // Future<void> _delOrigins(Place place) async {
  //   for (var photo in place.photos) {
  //     try {
  //       await FirebaseStorage.instance.ref().child(photo.originUrl).delete();
  //     } catch (e) {
  //       print(e);
  //     }
  //   }
  // }
}
