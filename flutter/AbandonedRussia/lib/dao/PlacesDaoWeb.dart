import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDao.dart';

class PlacesDaoWeb extends PlacesDao {
  Future<Uint8List> getPhotoOrigin(String url, int size) {
    return Future(() => null);
  }

  Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();

    var ref =
        await FirebaseFirestore.instance.collection('Places').add(toMap(place));

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

    place.id = ref.id;
    return place;
  }

  Future<void> put(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .set(toMap(place));
  }

  Future<void> del(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }
}
