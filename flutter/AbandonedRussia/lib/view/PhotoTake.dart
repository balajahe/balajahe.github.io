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
      future: camera.init(),
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

  @override
  build(context) {
    _place = context.watch<Place>();
    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.camera_sharp),
        tooltip: 'Снимок!',
        onPressed: _takePhoto,
      ),
      body: Stack(children: [
        Center(child: widget._camera.previewWidget),
        PhotoContainer(_place),
      ]),
    );
  }

  Future<void> _takePhoto() async {
    startWaiting(context);
    _photo = await widget._camera.takePhoto();
    stopWaiting(context);

    var approved = await Navigator.push(
        context, MaterialPageRoute(builder: (_) => PhotoApprove(_photo)));
    if (approved != null) {
      _place.addPhoto(PlacePhoto(origin: _photo));
    }
  }

  @override
  void dispose() {
    widget._camera.dispose();
    super.dispose();
  }
}
