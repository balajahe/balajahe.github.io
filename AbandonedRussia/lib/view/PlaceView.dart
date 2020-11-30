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
  build(context) => Scaffold(
        appBar: AppBar(
          title: Text('Просмотр'),
          actions: [
            IconButton(
                tooltip: 'Удалить',
                icon: Icon(Icons.delete),
                onPressed: () => _del(context)),
            IconButton(
                tooltip: 'Редактировать',
                icon: Icon(Icons.edit),
                onPressed: () => _edit(context)),
          ],
        ),
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              PaddingText(
                _place.title,
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                selectable: true,
                top: 3,
              ),
              PaddingText(_place.labelsAsString,
                  style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
                  selectable: true),
              PaddingText(_place.description, selectable: true),
              PhotoContainer(_place, PhotoContainerMode.view),
              LocationMap(_place.location),
              PaddingText(
                  'добавлено: ' +
                      _place.created.toString() +
                      '\nпользователем: ' +
                      _place.creator.toString(),
                  style: TextStyle(fontSize: 12),
                  selectable: true),
              PaddingText('ID: ' + _place.id,
                  style: TextStyle(fontSize: 10), selectable: true),
            ],
          ),
        ),
      );

  void _del(context) {
    if (_checkAccess()) {
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
                  try {
                    await context.read<Places>().del(_place);
                  } catch (e) {
                    await showError(context, e);
                  }
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
    if (_checkAccess()) {
      await Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => PlaceAddEdit(PlaceEditMode.edit, _place)),
      );
      Navigator.pop(context);
    } else {
      _denied(context);
    }
  }

  bool _checkAccess() => (ALLOW_EDIT_ALL == '' ||
      App.appUser.metaHash() == ALLOW_EDIT_ALL ||
      _place.creator.uid == App.appUser.uid);

  void _denied(context) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text('Редактировать и удалять вы можете только свои объекты!')));
}
