import 'dart:typed_data';
import 'package:image/image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

import '../model/AppUser.dart';

class Photo {
  Uint8List thumbnail;
  Uint8List origin;
  String originUrl;
  Photo({this.thumbnail, this.origin, this.originUrl});

  Future<void> generateThumbnail(Orientation orientation) async {
    thumbnail = await compute(_generateThumbnail, origin);
  }

  // void generateThumbnailSync(Orientation orientation) async {
  //   thumbnail = _generateThumbnail(origin);
  // }
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

  String get fullDescription =>
      labelsAsString + (description.length > 0 ? '\n' + description : '');

  Future<void> addPhoto(Photo photo, Orientation orientation) async {
    photos.add(photo);
    await photo.generateThumbnail(orientation);
    notifyListeners();
  }
}

Uint8List _generateThumbnail(Uint8List origin) =>
    encodePng(copyResize(decodeImage(origin), width: 70));
