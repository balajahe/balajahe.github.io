import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/CameraAbstract.dart';
import '../view/commonWidgets.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  CameraAbstract _camera;
  Uint8List _photo;
  bool isWorking = false;

  @override
  build(context) {
    _camera = context.watch<CameraAbstract>();
    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
          future: _camera.initCamera(),
          builder: (context, snapshot) {
            if (snapshot.hasData && !isWorking) {
              return snapshot.data;
            } else {
              return WaitingOrError(error: snapshot.error, transparent: true);
            }
          }),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.camera_sharp),
        tooltip: 'Снимок!',
        onPressed: _takePhoto,
      ),
    );
  }

  Future<void> _takePhoto() async {
    setState(() => isWorking = true);
    _photo = await _camera.takePhoto();
    setState(() => isWorking = false);

    showDialog<void>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Одобрить фото'),
        content: Image.memory(_photo),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.cancel),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          IconButton(
            icon: Icon(Icons.save),
            onPressed: () {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                Navigator.pop(context);
                Navigator.pop(context, _photo);
              });
            },
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _camera.disposeCamera();
    super.dispose();
  }
}
