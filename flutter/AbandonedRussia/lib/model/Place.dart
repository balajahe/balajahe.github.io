import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:image/image.dart';

import '../settings.dart';
import '../model/App.dart';
import '../dao/PlacesDao.dart';

class PlacePhoto {
  Uint8List thumbnail;
  Uint8List origin;
  String originUrl;
  int originSize;
  PlacePhoto({this.thumbnail, this.origin, this.originUrl, this.originSize});

  Future<void> generateThumbnail() async {
    thumbnail = await compute(_generateThumbnail, origin);
  }

  Future<void> loadPhotoOrigin() async {
    if (origin == null && originUrl != null) {
      origin = await PlacesDao.instance.getPhotoOrigin(originUrl, originSize);
    }
  }
}

class PlaceLocation {
  final double latitude;
  final double longitude;
  final double accuracy;
  PlaceLocation(this.latitude, this.longitude, [this.accuracy]);
}

class Place with ChangeNotifier {
  String id;
  AppUser creator;
  DateTime created;
  String title;
  String description;
  List<String> labels;
  List<PlacePhoto> photos;
  PlaceLocation location;

  Place({
    this.id,
    this.creator,
    this.created,
    this.title,
    this.description,
    this.labels,
    this.photos,
    this.location,
  }) {
    if (labels == null) {
      labels = [];
    }
    if (photos == null) {
      photos = [];
    }
  }

  String get labelsAsString => labels.toString();

  Future<void> addPhoto(PlacePhoto photo) async {
    photos.add(photo);
    notifyListeners();
    await photo.generateThumbnail();
    notifyListeners();
  }
}

Uint8List _generateThumbnail(Uint8List origin) =>
    encodePng(copyResize(decodeImage(origin), width: THUMBNAIL_WIDTH));
