import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/App.dart';
import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDaoMobile.dart';
import '../dao/PlacesDaoWeb.dart';

abstract class PlacesDao {
  static PlacesDao get instance =>
      (kIsWeb) ? PlacesDaoWeb() : PlacesDaoMobile();

  Place fromMap(String id, Map<String, dynamic> data) {
    var place = Place(
      id: id,
      creator: AppUser(
        uid: data['creator']['uid'],
        registered: data['creator']['registered'].toDate(),
      ),
      created: data['created'].toDate(),
      title: data['title'],
      description: data['description'],
      labels: (data['labels'] is List) ? List<String>.from(data['labels']) : [],
      location: (data['location'] != null)
          ? PlaceLocation(
              0.0 + data['location']['latitude'],
              0.0 + data['location']['longitude'],
              0.0 + data['location']['accuracy'],
            )
          : null,
    );
    if (data['photos'] is List) {
      place.photos = data['photos']
          .map<PlacePhoto>((photo) => PlacePhoto(
                place: place,
                thumbnail: base64Decode(photo['thumbnail']),
                originSize: photo['originSize'],
                originUrl: photo['originUrl'],
              ))
          .toList();
    }
    return place;
  }

  Map<String, dynamic> toMap(Place v) {
    return {
      'id': v.id,
      'creator': (v.creator != null)
          ? {
              'uid': v.creator.uid,
              'registered': Timestamp.fromDate(v.creator.registered),
            }
          : null,
      'created': (v.created != null) ? Timestamp.fromDate(v.created) : null,
      'title': (v.title != null) ? v.title : '',
      'description': (v.description != null) ? v.description : '',
      'labels': List<String>.from(v.labels),
      'photos': v.photos
          .map<Map<String, dynamic>>((photo) => {
                'thumbnail': base64Encode(photo.thumbnail),
                'originSize': photo.originSize,
                'originUrl': photo.originUrl,
              })
          .toList(),
      'location': (v.location != null)
          ? {
              'latitude': v.location.latitude,
              'longitude': v.location.longitude,
              'accuracy': v.location.accuracy,
            }
          : null,
    };
  }

  Future<List<Place>> getNextPart({
    DateTime after,
    int count,
    bool onlyMine = false,
    String searchString,
  }) async {
    QuerySnapshot data;
    if (onlyMine) {
      data = await FirebaseFirestore.instance
          .collection('Places')
          .where('creator.uid', isEqualTo: Database.currentUser.uid)
          .orderBy('created', descending: true)
          .startAfter(
              [(after != null) ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
      return data.docs.map((v) => fromMap(v.id, v.data())).toList();
    } else if (searchString != null && searchString.length > 0) {
      var ids = List<String>();
      var search = await FirebaseFirestore.instance
          .collection('PlacesIndex')
          .orderBy('created', descending: true)
          .startAfter(
              [(after != null) ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
      search.docs.forEach((v) {
        String text = v['text'];
        if (text.contains(searchString.toLowerCase())) {
          ids.add(v.id);
        }
      });

      if (ids.length > 0) {
        data = await FirebaseFirestore.instance
            .collection('Places')
            .where('id', whereIn: ids)
            .orderBy('created', descending: true)
            .get();
        return data.docs.map((v) => fromMap(v.id, v.data())).toList();
      } else {
        return [];
      }
    } else {
      data = await FirebaseFirestore.instance
          .collection('Places')
          .orderBy('created', descending: true)
          .startAfter(
              [(after != null) ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
      return data.docs.map((v) => fromMap(v.id, v.data())).toList();
    }
  }

  Future<void> _put(Place place) async {
    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .set(toMap(place));

    await FirebaseFirestore.instance
        .collection('PlacesIndex')
        .doc(place.id)
        .set(
      {
        'created': place.created,
        'text': place.title.toLowerCase() +
            '\n' +
            place.description.toLowerCase() +
            '\n' +
            place.labelsAsString.toLowerCase() +
            '\n' +
            place.created.toString() +
            '\n' +
            place.creator.registered.toString()
      },
    );
  }

  Future<Place> add(Place place) async {
    place.creator = Database.currentUser;
    place.created = Timestamp.now().toDate();

    var id = FirebaseFirestore.instance.collection('Places').doc().id;
    place.id = id;

    await _put(place);
    await addOrigins(place);

    return place;
  }

  Future<void> put(Place place) async {
    await _put(place);
    await addOrigins(place);
  }

  Future<void> del(Place place) async {
    await delOrigins(place);

    await FirebaseFirestore.instance
        .collection('PlacesIndex')
        .doc(place.id)
        .delete();

    await FirebaseFirestore.instance
        .collection('Places')
        .doc(place.id)
        .delete();
  }

  Future<Uint8List> getPhotoOrigin(String url, int size);

  Future<void> addOrigins(Place place);

  Future<void> delOrigins(Place place);
}
