import 'dart:typed_data';
import 'package:image/image.dart';

import '../model/AppUser.dart';

class Place {
  String id;
  AppUser creator;
  DateTime created;
  String title;
  String description;
  List<String> labels;
  List<Uint8List> photos;
  List<Uint8List> thumbnails;

  Place(
      {this.id,
      this.creator,
      this.created,
      this.title,
      this.description,
      this.labels,
      this.photos,
      this.thumbnails});

  void generateThumbnails() {
    thumbnails = List<Uint8List>.from(
        photos.map((v) => copyResize(decodeImage(v), height: 60).getBytes()));
  }
}
