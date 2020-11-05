import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/CameraAbstract.dart';
import '../model/CameraWeb.dart';
import '../model/CameraFlutter.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoAccept.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  CameraAbstract _camera;
  bool _isCapturing = false;

  @override
  build(context) {
    if (kIsWeb)
      _camera = context.watch<CameraWeb>();
    else
      _camera = context.watch<CameraFlutter>();

    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
          future: _camera.initCamera(),
          builder: (context, snapshot) {
            if (snapshot.hasData && !_isCapturing) {
              return snapshot.data;
            } else {
              return WaitingOrError(error: snapshot.error);
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
    setState(() => _isCapturing = true);
    var photoData = await _camera.takePhoto();
    var accepted = await Navigator.push(context,
        MaterialPageRoute(builder: (context) => PhotoAccept(photoData)));
    if (accepted != null) {
      Navigator.pop(context, photoData);
    } else {
      setState(() => _isCapturing = false);
    }
  }

  @override
  void dispose() {
    _camera.disposeCamera();
    super.dispose();
  }
}
