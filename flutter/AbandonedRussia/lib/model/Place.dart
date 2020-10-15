import 'package:flutter/material.dart';

class Place {
  final int id;
  String title;
  String description;
  final List<Image> images = [];
  final List<String> labels = [];

  Place(this.id);

  factory Place.fromMap(int id, Map<String, dynamic> data) {
    var place = Place(id);
    place.title = data['title'];
    return place;
  }
}
