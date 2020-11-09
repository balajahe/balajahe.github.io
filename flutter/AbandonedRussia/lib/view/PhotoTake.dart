import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/CameraAbstract.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';

class PhotoTake extends StatelessWidget {
  @override
  build(context) {
    var camera = context.watch<CameraAbstract>();
    return FutureBuilder(
      future: camera.initCamera(),
      builder: (context, snapshot) =>
          snapshot.connectionState == ConnectionState.done && !snapshot.hasError
              ? _PhotoTakeForm(camera)
              : WaitingOrError(error: snapshot.error),
    );
  }
}

class _PhotoTakeForm extends StatefulWidget {
  final CameraAbstract _camera;
  _PhotoTakeForm(this._camera);

  @override
  createState() => _PhotoTakeFormState();
}

class _PhotoTakeFormState extends State<_PhotoTakeForm> {
  Place _place;
  Uint8List _photo;
  bool isWorking = false;

  @override
  build(context) {
    _place = context.watch<Place>();
    return Stack(children: [
      Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: Stack(children: [
          widget._camera.previewWidget,
          PhotoContainer(_place),
        ]),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Снимок!',
          onPressed: _takePhoto,
        ),
      ),
      isWorking ? WaitingOrError(transparent: true) : Container()
    ]);
  }

  Future<void> _takePhoto() async {
    setState(() => isWorking = true);
    _photo = await widget._camera.takePhoto();
    setState(() => isWorking = false);

    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Одобрить фото ?'),
        content: Image.memory(_photo),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.clear),
            tooltip: 'Удалить',
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          IconButton(
            icon: Icon(Icons.done),
            tooltip: 'Одобрить',
            onPressed: () async {
              await approvePhoto();
              Navigator.pop(context, true);
            },
          ),
        ],
      ),
    );
  }

  Future<void> approvePhoto() async {
    var photo = Photo(origin: _photo);
    _place.photos.add(photo);
    setState(() => isWorking = true);
    await photo.generateThumbnail(MediaQuery.of(context).orientation);
    setState(() => isWorking = false);
  }

  @override
  void dispose() {
    widget._camera.disposeCamera();
    super.dispose();
  }
}
