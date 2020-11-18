import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:html' as html;
import 'package:flutter/material.dart';

import '../model/Camera.dart';

class CameraWeb implements Camera {
  static html.VideoElement _htmlVideoElement;
  static HtmlElementView _previewWidget;
  html.MediaStream _videoStream;
  html.ImageCapture _imageCapture;

  Future<void> init() async {
    // это нужно делать только один раз, иначе будут глюки
    if (_htmlVideoElement == null) {
      _htmlVideoElement = html.VideoElement();
      ui.platformViewRegistry.registerViewFactory(
          'htmlVideoElement', (int viewId) => _htmlVideoElement);
      _previewWidget =
          HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');
    }

    _videoStream = await html.window.navigator.getUserMedia(video: {
      'facingMode': {'ideal': "environment"}
    }, audio: false);

    _htmlVideoElement.srcObject = _videoStream;

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);
  }

  void play() {
    _htmlVideoElement.play();
  }

  void dispose() {
    _htmlVideoElement.srcObject = null;

    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });
  }

  Widget get previewWidget => _previewWidget;

  Future<Uint8List> takePhoto() async {
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    await reader.onLoadEnd.first;
    return reader.result;
  }
}
