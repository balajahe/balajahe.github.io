import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
//import 'package:path_provider/path_provider.dart';

import '../view/commonWidgets.dart';

class TakePhoto extends StatefulWidget {
  @override
  createState() => _TakePhotoState();
}

class _TakePhotoState extends State<TakePhoto> {
  CameraController _camera;

  @override
  build(context) => Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
        future: _initCamera(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return CameraPreview(_camera);
          } else {
            return Waiting();
          }
        },
      ));

  Future<void> _initCamera() async {
    _camera =
        CameraController((await availableCameras())[0], ResolutionPreset.high);
    await _camera.initialize();
    // _dir = (await getTemporaryDirectory()).path;
    // _srvAddr = TextEditingController(text: widget.srvAddr);
    // final cams = ;
    // print('-------\n $cams \n $_dir \n-------');
    // _camera =
  }
}
