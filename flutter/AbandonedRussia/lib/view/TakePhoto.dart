import 'package:flutter/material.dart';
import 'dart:html';
import 'dart:ui' as ui;

import '../view/commonWidgets.dart';

class TakePhoto extends StatefulWidget {
  @override
  createState() => _TakePhotoState();
}

class _TakePhotoState extends State<TakePhoto> {
  Widget _cameraWidget;
  VideoElement _cameraVideoElement;
  ImageCapture _imageCapture;

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: FutureBuilder(
          future: _initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return _cameraWidget;
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
    var stream = await window.navigator.getUserMedia(video: true, audio: false);
    _cameraVideoElement = VideoElement()
      ..autoplay = true
      ..srcObject = stream;

    ui.platformViewRegistry.registerViewFactory(
      'cameraVideoElement',
      (int viewId) => _cameraVideoElement,
    );
    _cameraWidget = HtmlElementView(
      key: UniqueKey(),
      viewType: 'cameraVideoElement',
    );

    _imageCapture = ImageCapture(stream.getVideoTracks()[0]);
  }
}
