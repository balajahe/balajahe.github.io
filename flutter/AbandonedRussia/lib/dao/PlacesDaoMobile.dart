import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

import '../dao/Database.dart';
import '../dao/PlacesDao.dart';
import '../model/Place.dart';

class PlacesDaoMobile extends PlacesDao {
  Future<List<Place>> getNextPart({
    DateTime after,
    int count,
    bool onlyMine = false,
  }) async {
    QuerySnapshot data;
    if (onlyMine) {
      data = await FirebaseFirestore.instance
          .collection('Places')
          .where('creator.uid', isEqualTo: Database.currentUser.uid)
          .orderBy('created', descending: true)
          .startAfter(
              [after != null ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
    } else {
      data = await FirebaseFirestore.instance
          .collection('Places')
          .orderBy('created', descending: true)
          .startAfter(
              [after != null ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
    }
    return data.docs.map((v) => fromMap(v.id, v.data())).toList();
  }

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
