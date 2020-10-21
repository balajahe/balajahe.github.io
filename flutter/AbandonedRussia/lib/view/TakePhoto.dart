import 'package:flutter/material.dart';
import 'dart:html';
import 'dart:ui' as ui;

import '../view/commonWidgets.dart';

class TakePhoto extends StatefulWidget {
  @override
  createState() => _TakePhotoState();
}

class _TakePhotoState extends State<TakePhoto> {
  MediaStream _videoStream;
  VideoElement _videoElement;
  Widget _videoWidget;
  ImageCapture _imageCapture;

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: FutureBuilder(
          future: _initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return _videoWidget;
            } else {
              return Waiting();
            }
          },
        ),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Сделать снимок',
          onPressed: () async {
            var photoBlob = await _imageCapture.takePhoto();
            //var photoUrl = URL.createObjectURL(photoBlob);
            Navigator.pop(context, photoBlob);
          },
        ),
      );

  Future<void> _initCamera() async {
    ui.platformViewRegistry.registerViewFactory(
        'cameraVideoElement', (int viewId) => _videoElement);
    _videoWidget =
        HtmlElementView(key: UniqueKey(), viewType: 'cameraVideoElement');

    _videoStream = await window.navigator.mediaDevices.getUserMedia({
      'video': {
        'facingMode': {'ideal': "environment"}
      },
      'audio': false,
    });
    _videoElement = VideoElement()
      ..srcObject = _videoStream
      ..autoplay = true;

    _imageCapture = ImageCapture(_videoStream.getVideoTracks()[0]);
  }

  @override
  void dispose() {
    super.dispose();
    _videoStream.getTracks().forEach((track) => track.stop());
  }
}
