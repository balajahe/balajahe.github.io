import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'Database.dart';
import 'PlacesDaoAbstract.dart';
import '../model/Place.dart';
import '../model/AppUser.dart';

class PlacesDaoFirestore implements PlacesDaoAbstract {
  Place _fromMap(String id, Map<String, dynamic> data) => Place(
        id: id,
        creator: AppUser(
          uid: data['creator']['uid'],
          created: data['creator']['created'].toDate(),
        ),
        created: data['created'].toDate(),
        title: data['title'],
        description: data['description'],
        labels: data['labels'] is List ? List<String>.from(data['labels']) : [],
        photos: data['thumbnails'] is List
            ? data['thumbnails']
                .map<Photo>((v) => Photo(thumbnail: base64Decode(v)))
                .toList()
            : [],
      );

  Map<String, dynamic> _toMap(Place v) {
    return {
      'creator': {
        'uid': v.creator.uid,
        'created': Timestamp.fromDate(v.creator.created),
      },
      'created': Timestamp.fromDate(v.created),
      'title': v.title,
      'description': v.description,
      'labels': List<String>.from(v.labels),
      'thumbnails':
          v.photos.map<String>((v) => base64Encode(v.thumbnail)).toList(),
    };
  }

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
    return data.docs.map((v) => _fromMap(v.id, v.data())).toList();
  }

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
    var addedPlace = await FirebaseFirestore.instance
        .collection('Places')
        .add(_toMap(place));
    place.id = addedPlace.id;
    return place;
  }

  Future<void> del(String id) async {
    await FirebaseFirestore.instance.collection('Places').doc(id).delete();
  }
}
