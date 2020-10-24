import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:html' as html;

import '../view/commonWidgets.dart';
import '../view/PhotoAccept.dart';

class PhotoTake extends StatefulWidget {
  @override
  createState() => _PhotoTakeState();
}

class _PhotoTakeState extends State<PhotoTake> {
  html.MediaStream _videoStream;
  html.VideoElement _htmlVideoElement;
  Widget _videoPreview;
  html.ImageCapture _imageCapture;
  bool _isCapturing = false;

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: FutureBuilder(
          future: _initCamera(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              return Stack(children: [
                _videoPreview,
                _isCapturing ? Waiting() : Container(),
              ]);
            } else {
              return Waiting();
            }
          },
        ),
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Сделать снимок',
          onPressed: _take,
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

  Future<void> _take() async {
    setState(() => _isCapturing = true);
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    reader.onLoadEnd.listen((_) {
      var photoData = reader.result;
      setState(() => _isCapturing = false);
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => PhotoAccept(photoData)));
    });
  }

  @override
  void dispose() {
    super.dispose();
    _htmlVideoElement.pause();
    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });
    print('dispose');
  }
}
