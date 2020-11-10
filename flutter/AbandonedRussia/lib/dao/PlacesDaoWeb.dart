import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../dao/Database.dart';
import '../dao/PlacesDao.dart';
import '../model/Place.dart';

class PlacesDaoWeb extends PlacesDao {
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

  Future<Uint8List> getPhotoOrigin(String url, int size) =>
      Future(() => Uint8List(0));

  Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();
    // print(fb.app().storage());
    // for (var photoData in place.photos) {
    //   var storageRef = fb
    //       .app()
    //       .storage()
    //       .ref('photos/${DateTime.now().millisecondsSinceEpoch}');
    //   var snapshot = await storageRef.put(photoData).future;
    //   var url = await snapshot.ref.getDownloadURL();
    //   print(url);
    // }
    var addedPlace =
        await FirebaseFirestore.instance.collection('Places').add(toMap(place));
    place.id = addedPlace.id;
    return place;
  }

  Future<void> put(Place place) => Future(() {});

  Future<void> del(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }
}
