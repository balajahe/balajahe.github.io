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

    var id = FirebaseFirestore.instance.collection('Places').doc().id;
    place.id = id;

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(id)
        .set(toMap(place));

//    await _addOrigins(place);

    return place;
  }

  Future<void> put(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .set(toMap(place));

//    await _addOrigins(place);
  }

  Future<void> del(Place place) async {
//    await _delOrigins(place);

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }
}
