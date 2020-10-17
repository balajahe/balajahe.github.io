import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';

class PlaceEditPage extends StatelessWidget {
  final Place place;

  PlaceEditPage(this.place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(place.title),
      ),
      body: null,
    );
  }
}
