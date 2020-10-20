import 'package:flutter/material.dart';

import '../model/Place.dart';

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
          ListTile(
            title: SelectableText(place.title),
            subtitle: SelectableText(place.labels.toString()),
          ),
          ListTile(
            title: SelectableText(place.description),
          ),
          ListTile(
              subtitle: SelectableText('добавлено ' +
                  place.created.toString() +
                  '\nпользователем ' +
                  place.creator.created.toString())),
        ],
      ),
    );
  }
}
