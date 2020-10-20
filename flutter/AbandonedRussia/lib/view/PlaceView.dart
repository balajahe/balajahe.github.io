import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';

class PlaceView extends StatelessWidget {
  final Place place;

  PlaceView(this.place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(place.title),
      ),
      body: ListView(
        children: [
          ListTile(title: Text(place.title)),
          ListTile(title: Text(place.description)),
          ListTile(
              subtitle: Text(place.created.toString() + ' - ' + place.creator)),
        ],
      ),
    );
  }
}
