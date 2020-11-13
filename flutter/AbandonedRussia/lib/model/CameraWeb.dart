import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:html' as html;
import 'package:flutter/material.dart';

import '../model/Camera.dart';

class CameraWeb implements Camera {
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

  Future<void> init() async {
    if (!_initiated) {
      _initiated = true;

      _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
        'video': {
          'facingMode': {'exact': 'environment'}
        }
      });

      _htmlVideoElement.srcObject = _videoStream;

      _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);

      _preview =
          HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');
    }
    _htmlVideoElement.play();
    print(_htmlVideoElement.width);
  }

  void dispose() {
    _initiated = false;

    _htmlVideoElement
      ..pause()
      ..srcObject = null;

    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });
  }

  Widget get previewWidget => _preview;

  Future<Uint8List> takePhoto() async {
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    await reader.onLoadEnd.first;
    return reader.result;
  }
}
