import 'package:AbandonedRussia/settings.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import '../model/Location.dart';

import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'LocationMap.dart';
import 'PhotoTake.dart';

class PlaceAddEdit extends StatelessWidget {
  @override
  build(context) => FutureBuilder(
        future: Future.wait([
          context.watch<Labels>().init(),
          context.watch<Location>().init(),
        ]),
        builder: (context, snapshot) =>
            snapshot.connectionState == DONE && !snapshot.hasError
                ? _PlaceAddEditForm()
                : WaitingOrError(error: snapshot.error),
      );
}

class _PlaceAddEditForm extends StatefulWidget {
  @override
  createState() => _PlaceAddEditFormState();
}

class _PlaceAddEditFormState extends State<_PlaceAddEditForm> {
  Place _place;
  List<String> _allLabels;
  Location _location;
  final _form = GlobalKey<FormState>();
  TextEditingController _title;
  TextEditingController _description;
  BuildContext _scaffoldContext;

  @override
  build(context) {
    _place = context.watch<Place>();
    _allLabels = context.watch<Labels>().getAll();
    _location = context.watch<Location>();

    _title = TextEditingController(text: _place.title);
    _description = TextEditingController(text: _place.description);

    return WillPopScope(
      onWillPop: () => _onExit(context),
      child: Scaffold(
        appBar: AppBar(
          title: Text('Новый объект'),
          actions: [
            Builder(
              builder: (context) {
                _scaffoldContext = context;
                return IconButton(
                    icon: Icon(Icons.save),
                    tooltip: 'Сохранить',
                    onPressed: _save);
              },
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          tooltip: 'Добавить фото',
          child: Icon(Icons.photo_camera),
          onPressed: _addPhoto,
        ),
        body: SingleChildScrollView(
          child: Form(
            key: _form,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                TextFormField(
                  controller: _title,
                  decoration: InputDecoration(labelText: 'Краткое название'),
                ),
                TextFormField(
                  controller: _description,
                  decoration: InputDecoration(labelText: 'Описание'),
                  minLines: 3,
                  maxLines: 7,
                ),
                Container(
                  constraints: BoxConstraints(minHeight: LABEL_BUTTON_HEIGHT),
                  child: Wrap(
                    spacing: LABEL_BUTTON_SPACE,
                    children: _place.labels
                        .map((v) => Container(
                            height: LABEL_BUTTON_HEIGHT,
                            child: TextButton(
                              style: LABEL_BUTTON_STYLE,
                              child: Text(v),
                              onPressed: () => _deselectLabel(v),
                            )))
                        .toList(),
                  ),
                ),
                Container(
                  child: Row(children: [
                    Text('Добавить метку: ',
                        style: TextStyle(fontStyle: FontStyle.italic)),
                    Expanded(
                      child: Container(
                          height: 1,
                          margin: EdgeInsets.only(top: 10),
                          color: Colors.grey[400]),
                    ),
                  ]),
                ),
                Wrap(
                  spacing: LABEL_BUTTON_SPACE,
                  children: _allLabels
                      .map((v) => Container(
                          height: LABEL_BUTTON_HEIGHT,
                          child: TextButton(
                            style: LABEL_BUTTON_STYLE,
                            child: Text(v),
                            onPressed: () => _selectLabel(v),
                          )))
                      .toList(),
                ),
                PhotoContainer(_place),
                StreamBuilder(
                  stream: _location.locationChanges,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      _place.location = PlaceLocation(
                        snapshot.data.latitude,
                        snapshot.data.longitude,
                        snapshot.data.accuracy,
                      );
                      return LocationMap(_place.location);
                    } else {
                      return Container();
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _addPhoto() async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChangeNotifierProvider.value(
          value: _place,
          child: PhotoTake(),
        ),
      ),
    );
  }

  void _selectLabel(String label) {
    setState(() {
      _allLabels.remove(label);
      _place.labels.add(label);
    });
  }

  void _deselectLabel(String label) {
    setState(() {
      _allLabels.add(label);
      _place.labels.remove(label);
    });
  }

  Future<bool> _onExit(newContext) async {
    if (_title.text.length > 0 ||
        _description.text.length > 0 ||
        _place.labels.length > 0 ||
        _place.photos.length > 0) {
      var isSave = await showDialog(
        barrierDismissible: false,
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Сохранить изменения?'),
          actions: <Widget>[
            TextButton(
                child: Text('Нет'),
                onPressed: () => Navigator.pop(context, false)),
            TextButton(
                child: Text('Да'),
                onPressed: () => Navigator.pop(context, true)),
          ],
        ),
      );
      if (isSave is bool && isSave) {
        _save();
        return false;
      } else if (isSave is bool) {
        Navigator.pop(context);
      }
    }
    return true;
  }

  Future<void> _save() async {
    if (_form.currentState.validate() &&
        _title.text.length > 0 &&
        _description.text.length > 0 &&
        _place.labels.length > 0 &&
        _place.photos.length > 0) {
      try {
        startWaiting(context);
        _place
          ..title = _title.text
          ..description = _description.text;
        await context.read<Places>().add(_place);
        stopWaiting(context);
        Navigator.pop(context, true);
      } catch (e) {
        showError(context, e);
      }
    } else {
      Scaffold.of(_scaffoldContext).showSnackBar(SnackBar(
          content: Text(
              'Заполните все поля, минимум одно фото, минимум одна метка!')));
    }
  }
}
