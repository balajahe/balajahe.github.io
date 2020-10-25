import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:html' as html;

class CameraProvider extends ChangeNotifier {
  html.VideoElement _htmlVideoElement;
  html.MediaStream _videoStream;
  html.ImageCapture _imageCapture;
  Widget _videoPreview;
  bool _isCapturing = false;

  CameraProvider() {
    _htmlVideoElement = html.VideoElement();
    ui.platformViewRegistry.registerViewFactory(
        'htmlVideoElement', (int viewId) => _htmlVideoElement);
  }

  Future<Widget> initCamera() async {
    _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
      'video': {"facingMode": "user"},
      'audio': false,
    });

    _htmlVideoElement
      ..srcObject = _videoStream
      ..play();

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);

    return HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');
  }

  // Future<void> takePhoto() async {
  //   var photoBlob = await _imageCapture.takePhoto();
  //   var reader = html.FileReader();
  //   reader.readAsArrayBuffer(photoBlob);
  //   reader.onLoadEnd.listen((_) async {
  //     var photoData = reader.result;
  //     var accepted = await Navigator.push(context,
  //         MaterialPageRoute(builder: (context) => PhotoAccept(photoData)));
  //     setState(() => _isCapturing = false);
  //     if (accepted != null) {
  //       Navigator.pop(context, photoData);
  //     }
  //   });
  // }
}
