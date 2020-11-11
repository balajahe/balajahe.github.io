import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Camera.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PhotoApprove.dart';

class PhotoTake extends StatelessWidget {
  @override
  build(context) {
    var camera = context.watch<Camera>();
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
  final Camera _camera;
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
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Снимок!',
          onPressed: _takePhoto,
        ),
        body: Stack(children: [
          widget._camera.previewWidget,
          PhotoContainer(_place),
        ]),
      ),
      isWorking ? WaitingOrError(transparent: true) : Container()
    ]);
  }

  Future<void> _takePhoto() async {
    setState(() => isWorking = true);
    _photo = await widget._camera.takePhoto();
    setState(() => isWorking = false);

    var approved = await Navigator.push(
        context, MaterialPageRoute(builder: (_) => PhotoApprove(_photo)));
    if (approved != null) {
      _place.addPhoto(
          Photo(origin: _photo), MediaQuery.of(context).orientation);
    }
  }

  @override
  void dispose() {
    widget._camera.disposeCamera();
    super.dispose();
  }
}
