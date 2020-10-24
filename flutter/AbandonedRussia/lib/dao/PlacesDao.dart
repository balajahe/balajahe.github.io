import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../dao/Database.dart';
import '../model/Place.dart';
import '../model/AppUser.dart';

class PlacesDao {
  static Place _fromMap(String id, Map<String, dynamic> data) => Place(
        id: id,
        creator: AppUser(
          uid: data['creator']['uid'],
          created: data['creator']['created'].toDate(),
        ),
        created: data['created'].toDate(),
        title: data['title'],
        description: data['description'],
        labels: data['labels'].map((v) => v).cast<String>().toList(),
        //photos: data['photos'].map((v) => v).cast<Uint8List>().toList(),
      );

  static Map<String, dynamic> _toMap(Place v) => {
        'creator': {
          'uid': v.creator.uid,
          'created': Timestamp.fromDate(v.creator.created),
        },
        'created': Timestamp.fromDate(v.created),
        'title': v.title,
        'description': v.description,
        'labels': v.labels,
        //'photos': v.photos,
      };

  static Future<List<Place>> getNextPart({
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
    return data.docs.map((v) => _fromMap(v.id, v.data())).toList();
  }

  static Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();
    var addedPlace = await FirebaseFirestore.instance
        .collection('Places')
        .add(_toMap(place));
    place.id = addedPlace.id;
    return place;
  }
}
