import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoMobile extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) {
    return FirebaseStorage.instance.ref().child(url).getData(size);
  }

  Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();

    var id = FirebaseFirestore.instance.collection('Places').doc().id;
    _setOriginUrls(place, id);

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(id)
        .set(toMap(place));

    await _addOrigins(place);

    place.id = id;
    return place;
  }

  Future<void> put(Place place) async {
    _setOriginUrls(place, place.id);

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

  void _setOriginUrls(Place place, String id) {
    place.photos.where((photo) => photo.originUrl == null).forEach((photo) =>
        photo.originUrl =
            'photos/$id/${Timestamp.now().microsecondsSinceEpoch}.png');
  }

  Future<void> _addOrigins(Place place) {
    return Future.wait(place.photos.where((photo) => photo.origin != null).map(
        (photo) => FirebaseStorage.instance
            .ref()
            .child(photo.originUrl)
            .putData(photo.origin)
            .asStream()
            .first));
  }

  Future<void> _delOrigins(Place place) {
    return Future.wait(place.photos
        .where((photo) => photo.originUrl != null)
        .map((photo) =>
            FirebaseStorage.instance.ref().child(photo.originUrl).delete()));
  }
}
