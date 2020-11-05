import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/CameraInterface.dart';
import '../model/CameraWeb.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoAccept.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  CameraInterface _camera;
  bool _isCapturing = false;

  @override
  build(context) {
    _camera = context.watch<CameraWeb>();
    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
          future: _camera.initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done &&
                !_isCapturing) {
              return snapshot.data;
            } else {
              return Working();
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
