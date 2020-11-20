import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Camera.dart';
import '../model/Place.dart';
import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'PhotoApprove.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  Place _place;
  Camera _camera;
  int _fromIndex;
  bool _done = false;
  dynamic _error;

  @override
  initState() {
    _camera = Camera.instance;
    _camera
        .init()
        .then((_) => setState(() => _done = true))
        .catchError((e) => setState(() => _error = e));
    _fromIndex = context.read<Place>().photos.length;
    super.initState();
  }

  @override
  build(context) {
    _place = context.watch<Place>();
    _camera.play();

    return (_done)
        ? Scaffold(
            appBar: AppBar(title: Text('Добавить фото')),
            floatingActionButton: FloatingActionButton(
              child: Icon(Icons.camera_sharp),
              tooltip: 'Снимок!',
              onPressed: _takePhoto,
            ),
            body: Stack(children: [
              Center(child: _camera.previewWidget),
              PhotoContainer(_place, PhotoContainerMode.edit, _fromIndex),
            ]),
          )
        : WaitingOrError(error: _error);
  }

  Future<void> _takePhoto() async {
    startWaiting(context);
    var photoData = await _camera.takePhoto();
    stopWaiting(context);

    var approved = await Navigator.push(
        context, MaterialPageRoute(builder: (_) => PhotoApprove(photoData)));
    if (approved != null) {
      _place.addPhoto(photoData);
    }
  }

  @override
  void dispose() {
    _camera.dispose();
    super.dispose();
  }
}
