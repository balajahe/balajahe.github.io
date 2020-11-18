import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
//import 'package:file_picker/file_picker.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import '../model/Location.dart';

import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'PhotoContainerEdit.dart';
import 'LocationMap.dart';
import 'PhotoTake.dart';
import 'PhotoApprove.dart';

enum PlaceEditMode { add, edit }

class PlaceAddEdit extends StatefulWidget {
  final PlaceEditMode _mode;
  final Place _place;
  PlaceAddEdit(this._mode, [this._place]);

  @override
  createState() => _PlaceAddEditState();
}

class _PlaceAddEditState extends State<PlaceAddEdit> {
  Place _place;
  Place _oldPlace;
  List<String> _allLabels;
  Location _location;
  final _form = GlobalKey<FormState>();
  TextEditingController _title;
  TextEditingController _description;
  BuildContext _scaffoldContext;
  bool _done = false;
  dynamic _error;

  @override
  initState() {
    _oldPlace = (widget._place == null) ? Place() : widget._place;
    _place = (widget._mode == PlaceEditMode.add) ? Place() : _oldPlace.clone();

    _title = TextEditingController(text: _place.title);
    _description = TextEditingController(text: _place.description);

    var labels = context.read<Labels>();
    var labelsFuture = labels.init();

    _location = Location();
    var locationFuture =
        (_place.location == null) ? _location.init() : Future<void>(() {});

    Future.wait([labelsFuture, locationFuture])
        .then((_) => setState(() {
              _allLabels = labels
                  .getAll()
                  .where((v) => !_place.labels.contains(v))
                  .toList();
              _done = true;
            }))
        .catchError((e) => setState(() => _error = e));
    super.initState();
  }

  @override
  build(context) => (_done)
      ? ChangeNotifierProvider.value(
          value: _place,
          child: Builder(builder: (context) {
            _place = context.watch<Place>();
            return WillPopScope(
              onWillPop: () => _onExit(context),
              child: Scaffold(
                appBar: AppBar(
                  title: Text('Новый объект'),
                  actions: [
                    IconButton(
                      tooltip: 'Фото из файла',
                      icon: Icon(Icons.add_a_photo),
                      onPressed: _addPhotoFromFile,
                    ),
                    Builder(builder: (context) {
                      _scaffoldContext = context;
                      return IconButton(
                          tooltip: 'Сохранить',
                          icon: Icon(Icons.save),
                          onPressed: _save);
                    }),
                  ],
                ),
                floatingActionButton: FloatingActionButton(
                  tooltip: 'Сфотографировать',
                  child: Icon(Icons.photo_camera),
                  onPressed: _addPhotoFromCamera,
                ),
                body: SingleChildScrollView(
                  child: Form(
                    key: _form,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        TextFormField(
                          controller: _title,
                          decoration:
                              InputDecoration(labelText: 'Краткое название'),
                        ),
                        TextFormField(
                          controller: _description,
                          decoration: InputDecoration(
                              labelText: 'Описание', border: InputBorder.none),
                          minLines: 3,
                          maxLines: 7,
                        ),
                        GroupSeparator('Метки'),
                        Container(
                          constraints:
                              BoxConstraints(minHeight: LABEL_BUTTON_HEIGHT),
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
                        GroupSeparator('Добавить метку'),
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
                        PhotoContainer(_place, PhotoContainerMode.edit),
                        _showMap(),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
        )
      : WaitingOrError(error: _error);

  Widget _showMap() {
    if (_place.location == null) {
      return StreamBuilder(
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
      );
    } else {
      return LocationMap(_place.location);
    }
  }

  Future<void> _addPhotoFromCamera() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChangeNotifierProvider.value(
          value: _place,
          child: PhotoTake(),
        ),
      ),
    );
    setState(() {});
  }

  Future<void> _addPhotoFromFile() async {
    // var paths =
    //     (await FilePicker.platform.pickFiles(type: FileType.image)).paths;
    // if (paths.length > 0) {
    //   var file = File(paths[0]);
    //   var photoData = await file.readAsBytes();
    //   var approved = await Navigator.push(
    //       context, MaterialPageRoute(builder: (_) => PhotoApprove(photoData)));
    //   if (approved != null) {
    //     _place.addPhoto(PlacePhoto(origin: photoData));
    //   }
    // }
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

  void _updatePlace() {
    _place
      ..title = _title.text
      ..description = _description.text;
  }

  Future<void> _save() async {
    _updatePlace();
    if (_place.photos.any((v) => v.thumbnail == null)) {
      Scaffold.of(_scaffoldContext).showSnackBar(SnackBar(
          content: Text('Подождите, пока все фотографии обработаются!')));
    } else if (!_form.currentState.validate() ||
        _place.title.length == 0 ||
        _place.description.length == 0 ||
        _place.labels.length == 0 ||
        _place.photos.length == 0) {
      Scaffold.of(_scaffoldContext).showSnackBar(SnackBar(
          content: Text(
              'Заполните все поля, минимум одно фото, минимум одна метка!')));
    } else {
      try {
        startWaiting(context);
        if (widget._mode == PlaceEditMode.add) {
          await context.read<Places>().add(_place);
        } else {
          await context.read<Places>().put(_place);
        }
        stopWaiting(context);
        Navigator.pop(context, true);
      } catch (e) {
        showError(context, e);
      }
    }
  }

  Future<bool> _onExit(newContext) async {
    _updatePlace();
    if (!_place.equals(_oldPlace)) {
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
}
