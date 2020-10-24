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
  html.VideoElement _htmlVideoElement;
  Widget _videoPreview;
  html.ImageCapture _imageCapture;
  dynamic _photoData;

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: FutureBuilder(
          future: _initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return Stack(children: [
                _videoPreview,
                _photoData != null ? Image.memory(_photoData) : Container(),
              ]);
            } else {
              return Waiting();
            }
          },
        ),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Сделать снимок',
          onPressed: _takePhoto,
        ),
      );

  Future<void> _initCamera() async {
    ui.platformViewRegistry.registerViewFactory(
        'htmlVideoElement', (int viewId) => _htmlVideoElement);
    _videoPreview =
        HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');

    _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
      'video': {
        'facingMode': {'ideal': "environment"}
      },
      'audio': false,
    });
    _htmlVideoElement = html.VideoElement()
      ..srcObject = _videoStream
      ..autoplay = true;

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);
  }

  Future<void> _takePhoto() async {
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    reader.onLoadEnd.listen((_) {
      print(reader.result);
      setState(() {
        _photoData = reader.result;
      });
      //Navigator.pop(context, null);
    });
  }

  @override
  void dispose() {
    _htmlVideoElement.remove();
    _videoStream.getTracks().forEach((track) => track.stop());
    super.dispose();
    print('dispose');
  }
}
