import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/App.dart';
import '../model/Place.dart';
import '../model/Places.dart';

import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/LocationMap.dart';
import '../view/PlaceAddEdit.dart';

class PlaceView extends StatelessWidget {
  final Place place;
  PlaceView(this.place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(place.title),
        actions: [
          Builder(
              builder: (context) => IconButton(
                  tooltip: 'Удалить',
                  icon: Icon(Icons.delete),
                  onPressed: () => _del(context))),
          Builder(
              builder: (context) => IconButton(
                  tooltip: 'Редактировать',
                  icon: Icon(Icons.edit),
                  onPressed: () => _edit(context))),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
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
            Padding(
              padding: EdgeInsets.only(top: 3, bottom: 3),
              child: SelectableText(place.description),
            ),
            PhotoContainer(place),
            LocationMap(place.location),
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
      ),
    );
  }

  void _del(context) {
    if (ALLOW_EDIT_ALL || place.creator.uid == App.currentUser.uid) {
      showDialog<void>(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Удалить объект?'),
          actions: <Widget>[
            TextButton(
                child: Text('Нет'), onPressed: () => Navigator.pop(context)),
            TextButton(
                child: Text('Да'),
                onPressed: () async {
                  startWaiting(context);
                  await context.read<Places>().del(place);
                  stopWaiting(context);
                  Navigator.pop(context);
                  Navigator.pop(context);
                }),
          ],
        ),
      );
    } else {
      _denied(context);
    }
  }

  Future<void> _edit(context) async {
    if (ALLOW_EDIT_ALL || place.creator.uid == App.currentUser.uid) {
      await Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => PlaceAddEdit(PlaceEditMode.edit, place)),
      );
      Navigator.pop(context);
    } else {
      _denied(context);
    }
  }

  void _denied(context) => Scaffold.of(context).showSnackBar(SnackBar(
      content:
          Text('Редактировать и удалять можно объекты, добавленные вами!')));
}
