import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoMobile extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) async {
    return await FirebaseStorage.instance.ref().child(url).getData(size);
  }

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

    place.photos.forEach((photo) async {
      await FirebaseStorage.instance
          .ref()
          .child(photo.originUrl)
          .putData(photo.origin);
    });
    return place;
  }

  Future<void> put(Place place) => Future(() {});

  Future<void> del(Place place) async {
    place.photos.forEach((photo) async {
      await FirebaseStorage.instance.ref().child(photo.originUrl).delete();
    });

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }
}
