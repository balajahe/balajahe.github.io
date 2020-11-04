import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/CameraModelWeb.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoAccept.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  CameraModelWeb _cameraProvider;
  bool _isCapturing = false;

  @override
  build(context) {
    _cameraProvider = context.watch<CameraModelWeb>();
    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
          future: _cameraProvider.initCamera(),
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
    var photoData = await _cameraProvider.takePhoto();
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
    _cameraProvider.disposeCamera();
    super.dispose();
  }
}
