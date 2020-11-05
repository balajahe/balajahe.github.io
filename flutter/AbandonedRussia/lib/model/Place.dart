import 'dart:typed_data';
import 'package:image/image.dart';
import 'package:flutter/material.dart';

import '../model/AbstractModel.dart';
import '../model/AppUser.dart';

class Photo {
  Uint8List thumbnail;
  Uint8List origin;
  String originUrl;

  Photo({this.thumbnail, this.origin, this.originUrl});
}

class Place extends AbstractModel {
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

  String get fullDescription => labels.toString() + '\n' + description;

  addPhoto(Uint8List origin, [Orientation orientation]) {
    startWorking();
    Uint8List thumbnail = encodePng(copyResize(decodeImage(origin), width: 60));
    photos.add(Photo(origin: origin, thumbnail: thumbnail));
    stopWorking();
    return thumbnail;
  }
}
