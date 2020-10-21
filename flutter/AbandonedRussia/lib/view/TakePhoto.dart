import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:html' as html;

import '../view/commonWidgets.dart';

class TakePhoto extends StatefulWidget {
  @override
  createState() => _TakePhotoState();
}

class _TakePhotoState extends State<TakePhoto> {
  html.MediaStream _videoStream;
  html.VideoElement _videoElement;
  Widget _videoWidget;
  html.ImageCapture _imageCapture;
  html.Blob _photoBlob;

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: FutureBuilder(
          future: _initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return Column(children: [
                _videoWidget,
                //Image.file(html_photoBlob,
              ]);
            } else {
              return Waiting();
            }
          },
        ),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Сделать снимок',
          onPressed: () async {
            _photoBlob = await _imageCapture.takePhoto();
            //var file = html.File(_photoBlob., 'photo.bmp');
            //var photoUrl = ui..createObjectURL(photoBlob);
            Navigator.pop(context, _photoBlob);
          },
        ),
      );

  Future<void> _initCamera() async {
    ui.platformViewRegistry
        .registerViewFactory('htmlVideoElement', (int viewId) => _videoElement);
    _videoWidget =
        HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');

    _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
      'video': {
        'facingMode': {'ideal': "environment"}
      },
      'audio': false,
    });
    _videoElement = html.VideoElement()
      ..srcObject = _videoStream
      ..autoplay = true;

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);
  }

  @override
  void dispose() {
    _videoStream.getTracks().forEach((track) => track.stop());
    super.dispose();
    print('dispose');
  }
}
