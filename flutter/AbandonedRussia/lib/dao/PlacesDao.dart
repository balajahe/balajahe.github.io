import 'dart:typed_data';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/AppUser.dart';
import '../model/Place.dart';
import '../dao/PlacesDaoWeb.dart';
import '../dao/PlacesDaoMobile.dart';

abstract class PlacesDao {
  static PlacesDao get instance => kIsWeb ? PlacesDaoWeb() : PlacesDaoMobile();

  Place fromMap(String id, Map<String, dynamic> data) => Place(
        id: id,
        creator: AppUser(
          uid: data['creator']['uid'],
          created: data['creator']['created'].toDate(),
        ),
        created: data['created'].toDate(),
        title: data['title'],
        description: data['description'],
        labels: data['labels'] is List ? List<String>.from(data['labels']) : [],
        photos: data['photos'] is List
            ? data['photos']
                .map<Photo>((photo) => Photo(
                      thumbnail: base64Decode(photo['thumbnail']),
                      originUrl: photo['originUrl'],
                      originSize: photo['originSize'],
                    ))
                .toList()
            : [],
      );

  Map<String, dynamic> toMap(Place v) {
    return {
      'creator': {
        'uid': v.creator.uid,
        'created': Timestamp.fromDate(v.creator.created),
      },
      'created': Timestamp.fromDate(v.created),
      'title': v.title,
      'description': v.description,
      'labels': List<String>.from(v.labels),
      'photos': v.photos
          .map<Map<String, dynamic>>((photo) => {
                'thumbnail': base64Encode(photo.thumbnail),
                'originUrl': photo.originUrl,
                'originSize': photo.origin.length,
              })
          .toList(),
    };
  }

  Future<List<Place>> getNextPart({
    DateTime after,
    int count,
    bool onlyMine = false,
  });

  Future<Uint8List> getPhotoOrigin(String url, int size);

  Future<Place> add(Place place);

  Future<void> put(Place place);

  Future<void> del(String id);
}
