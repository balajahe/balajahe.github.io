import 'dart:typed_data';
import 'package:image/image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

import '../settings.dart';
import '../model/AppUser.dart';
import '../dao/PlacesDao.dart';

class Photo {
  Uint8List thumbnail;
  Uint8List origin;
  String originUrl;
  int originSize;
  Photo({this.thumbnail, this.origin, this.originUrl, this.originSize});

  Future<void> generateThumbnail(Orientation orientation) async {
    thumbnail = await compute(_generateThumbnail, origin);
  }
}

class Place with ChangeNotifier {
  String id;
  AppUser creator;
  DateTime created;
  String title;
  String description;
  List<String> labels;
  List<Photo> photos;

  Place(
      {this.id,
      this.creator,
      this.created,
      this.title,
      this.description,
      this.labels,
      this.photos}) {
    if (labels == null) {
      labels = [];
    }
    if (photos == null) {
      photos = [];
    }
  }

  String get labelsAsString => labels.toString();

  Future<Uint8List> getPhotoOrigin(Photo photo) =>
      PlacesDao.instance.getPhotoOrigin(photo);

  Future<void> addPhoto(Photo photo, Orientation orientation) async {
    photos.add(photo);
    notifyListeners();
    await photo.generateThumbnail(orientation);
    notifyListeners();
  }
}

Uint8List _generateThumbnail(Uint8List origin) =>
    encodePng(copyResize(decodeImage(origin), width: THUMBNAIL_WIDTH));
