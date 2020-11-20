import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:image/image.dart';

import '../settings.dart';
import '../model/App.dart';
import '../dao/PlacesDao.dart';

class PlacePhoto {
  Place place;
  Uint8List origin;
  String originUrl;
  int originSize;
  Uint8List thumbnail;

  PlacePhoto(
      {@required this.place,
      this.origin,
      this.originUrl,
      this.originSize,
      this.thumbnail}) {
    if (origin != null) {
      originSize = origin.length;
    }
  }

  Future<void> generateThumbnail() async {
    thumbnail = await compute(_generateThumbnail, origin);
  }

  Future<void> loadPhotoOrigin() async {
    if (origin == null && originUrl != null) {
      origin = await PlacesDao.instance
          .getPhotoOrigin('${place.id}/$originUrl', originSize);
    }
  }
}

class PlaceLocation {
  final double latitude;
  final double longitude;
  final double accuracy;
  PlaceLocation(this.latitude, this.longitude, [this.accuracy = 0]);
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
    if (labels == null) labels = [];
    if (photos == null) photos = [];
  }

  Place clone() =>
      PlacesDao.instance.fromMap(id, PlacesDao.instance.toMap(this));

  bool equals(Place another) =>
      PlacesDao.instance.toMap(this).toString() ==
      PlacesDao.instance.toMap(another).toString();

  String get labelsAsString => labels.toString();

  Future<void> addPhoto(Uint8List origin) async {
    var photo = PlacePhoto(place: this, origin: origin);
    photo.originUrl = '${DateTime.now().microsecondsSinceEpoch}.png';
    photos.add(photo);
    notifyListeners();
    await photo.generateThumbnail();
    notifyListeners();
  }

  Future<void> removePhoto(PlacePhoto photo) async {
    photos.remove(photo);
    notifyListeners();
  }
}

Uint8List _generateThumbnail(Uint8List origin) {
  var image = decodeImage(origin);
  var thumbnail = (image.width > image.height)
      ? copyResize(image, height: THUMBNAIL_SIZE)
      : copyResize(image, width: THUMBNAIL_SIZE);
  return encodePng(thumbnail);
}
