import 'package:AbandonedRussia/view/commonWidgets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../view/PhotoContainer.dart';

class PlaceView extends StatelessWidget {
  final Place place;
  PlaceView(this.place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(place.title),
        actions: [
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: () async {
              waitStart(context);
              await context.read<Places>().del(place.id);
              waitStop(context);
              Navigator.pop(context);
            },
          ),
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        children: [
          PhotoContainer(place),
          ListTile(
            title: SelectableText(place.title),
            subtitle: SelectableText(place.labelsAsString),
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
