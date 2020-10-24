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
  Widget _videoElement;
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
                _videoElement,
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
          onPressed: _takePhoto,
        ),
      );

  Future<void> _initCamera() async {
    _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
      'video': {'facingMode': "environment"},
      'audio': false,
    });

    _htmlVideoElement = html.VideoElement();

    ui.platformViewRegistry.registerViewFactory(
        'htmlVideoElement', (int viewId) => _htmlVideoElement);

    _videoElement =
        HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');

    _htmlVideoElement
      ..srcObject = _videoStream
      ..play();

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);
  }

  @override
  void dispose() {
    super.dispose();
    //_htmlVideoElement.pause();
    //_htmlVideoElement.srcObject = null;
    //_htmlVideoElement.remove();
    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });
    print('dispose');
  }

  Future<void> _takePhoto() async {
    setState(() => _isCapturing = true);
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    reader.onLoadEnd.listen((_) async {
      var photoData = reader.result;
      var accepted = await Navigator.push(context,
          MaterialPageRoute(builder: (context) => PhotoAccept(photoData)));
      if (accepted) {
        Navigator.pop(context, photoData);
      } else {
        setState(() => _isCapturing = false);
      }
    });
  }
}
