import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/App.dart';
import '../model/Place.dart';
import '../model/Places.dart';

import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'LocationMap.dart';
import 'PlaceAddEdit.dart';

class PlaceView extends StatelessWidget {
  final Place _place;
  PlaceView(this._place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_place.title),
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
            Separator(),
            SelectableText(_place.title,
                style: TextStyle(fontWeight: FontWeight.bold)),
            Separator(),
            SelectableText(_place.labelsAsString,
                style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic)),
            Separator(),
            SelectableText(_place.description),
            PhotoContainer(_place, PhotoContainerMode.view),
            LocationMap(_place.location),
            Separator(),
            SelectableText(
              'добавлено ' +
                  _place.created.toString() +
                  '\nпользователем ' +
                  _place.creator.registered.toString(),
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  void _del(context) {
    if (ALLOW_EDIT_ALL || _place.creator.uid == App.currentUser.uid) {
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
                  await context.read<Places>().del(_place);
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
    if (ALLOW_EDIT_ALL || _place.creator.uid == App.currentUser.uid) {
      await Navigator.push(
          context,
          MaterialPageRoute(
              builder: (_) => PlaceAddEdit(PlaceEditMode.edit, _place)));
      Navigator.pop(context);
    } else {
      _denied(context);
    }
  }

  void _denied(context) => Scaffold.of(context).showSnackBar(SnackBar(
      content:
          Text('Редактировать и удалять можно объекты, добавленные вами!')));
}
