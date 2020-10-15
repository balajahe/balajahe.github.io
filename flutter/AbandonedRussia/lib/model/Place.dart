import 'package:flutter/material.dart';

class Place {
  final int id;
  String title;
  String description;
  final List<Image> images = [];
  final List<String> labels = [];

  Place(this.id);

  factory Place.fromMap(Map<String, dynamic> data) {
    var place = Place(data['id']);
    place.title = data['title'];
    return place;
  }
}
