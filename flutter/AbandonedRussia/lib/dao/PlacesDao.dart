import 'package:cloud_firestore/cloud_firestore.dart';

import '../dao/Database.dart';
import '../model/Place.dart';

class PlacesDao {
  static Future<List<Place>> getNextPart(DateTime from, int count) async {
    var data = await FirebaseFirestore.instance
        .collection('Places')
        .orderBy('created', descending: true)
        .startAfter([from != null ? Timestamp.fromDate(from) : Timestamp.now()])
        .limit(count)
        .get();
    return data.docs.map((v) => _fromMap(v.id, v.data())).toList();
  }

  static Future<Place> add(Place place) async {
    place.created = Timestamp.now().toDate();
    place.creator = Database.currentUser;
    var addedPlace = await FirebaseFirestore.instance
        .collection('Places')
        .add(_toMap(place));
    place.id = addedPlace.id;
    return place;
  }

  static Place _fromMap(String id, Map<String, dynamic> data) => Place(
        id: id,
        created: data['created'].toDate(),
        creator: data['creator'],
        title: data['title'],
        description: data['description'],
        labels: data['labels'].map((v) => v).cast<String>().toList(),
        images: data['images'].map((v) => v).cast<String>().toList(),
      );

  static Map<String, dynamic> _toMap(Place v) => {
        'created': Timestamp.fromDate(v.created),
        'creator': v.creator,
        'title': v.title,
        'description': v.description,
        'labels': v.labels,
        'images': v.images,
      };
}
