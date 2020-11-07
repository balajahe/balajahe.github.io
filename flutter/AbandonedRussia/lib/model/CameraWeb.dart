import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:html' as html;
import 'package:flutter/material.dart';

import '../model/CameraAbstract.dart';

class CameraWeb implements CameraAbstract {
  html.VideoElement _htmlVideoElement;
  html.MediaStream _videoStream;
  html.ImageCapture _imageCapture;
  HtmlElementView _preview;
  bool _initiated = false;

  CameraWeb() {
    _htmlVideoElement = html.VideoElement();

    ui.platformViewRegistry.registerViewFactory(
        'htmlVideoElement', (int viewId) => _htmlVideoElement);
  }

  Future<Widget> initCamera() async {
    if (!_initiated) {
      _initiated = true;

      _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
        'video': {
          'facingMode': {'exact': 'environment'}
        }
      });

      _htmlVideoElement
        ..srcObject = _videoStream
        ..play();

      _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);

      _preview =
          HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');
    }
    _htmlVideoElement.play();
    return _preview;
  }

  void disposeCamera() {
    _initiated = false;

    _htmlVideoElement
      ..pause()
      ..srcObject = null;

    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });
  }

  Future<Uint8List> takePhoto() async {
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    await reader.onLoadEnd.first;
    return reader.result;
  }
}
