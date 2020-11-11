import 'package:AbandonedRussia/view/commonWidgets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../view/PhotoContainer.dart';
import '../view/PlaceEdit.dart';

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
            onPressed: () => showDialog<void>(
              context: context,
              builder: (BuildContext context) => AlertDialog(
                title: Text('Удалить объект?'),
                actions: <Widget>[
                  TextButton(
                      child: Text('Нет'),
                      onPressed: () => Navigator.pop(context)),
                  TextButton(
                      child: Text('Да'),
                      onPressed: () async {
                        waitStart(context);
                        await context.read<Places>().del(place);
                        waitStop(context);
                        Navigator.pop(context);
                        Navigator.pop(context);
                      }),
                ],
              ),
            ),
          ),
          IconButton(
              icon: Icon(Icons.edit),
              onPressed: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => PlaceEdit(place)))),
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
            'Координаты: ${place.location.toString()}',
            style: TextStyle(fontSize: 12),
          ),
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
