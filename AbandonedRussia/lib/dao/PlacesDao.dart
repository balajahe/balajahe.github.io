import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/App.dart';
import '../model/Place.dart';
import '../dao/Database.dart';
import '../dao/PlacesDaoWeb.dart';
import '../dao/PlacesDaoMobile.dart';

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
    } else {
      data = await FirebaseFirestore.instance
          .collection('Places')
          .orderBy('created', descending: true)
          .startAfter(
              [(after != null) ? Timestamp.fromDate(after) : Timestamp.now()])
          .limit(count)
          .get();
    }
    return data.docs.map((v) => fromMap(v.id, v.data())).toList();
  }

  Future<Uint8List> getPhotoOrigin(String url, int size);

  Future<Place> add(Place place);

  Future<void> put(Place place);

  Future<void> del(Place place);
}
