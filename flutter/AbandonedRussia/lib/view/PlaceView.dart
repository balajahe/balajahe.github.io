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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(top: 5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SelectableText(
                  place.title,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SelectableText(
                  place.labelsAsString,
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
          PhotoContainer(place),
          SelectableText(place.description),
          Container(height: 5),
          SelectableText(
            'добавлено ' +
                place.created.toString() +
                '\nпользователем ' +
                place.creator.created.toString(),
            style: TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }
}
