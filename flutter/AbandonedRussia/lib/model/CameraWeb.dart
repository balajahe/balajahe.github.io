import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:html' as html;

import 'CameraAbstract.dart';

class CameraWeb extends ChangeNotifier implements CameraAbstract {
  html.VideoElement _htmlVideoElement;
  html.MediaStream _videoStream;
  html.ImageCapture _imageCapture;

  CameraWeb() {
    _htmlVideoElement = html.VideoElement();

    ui.platformViewRegistry.registerViewFactory(
        'htmlVideoElement', (int viewId) => _htmlVideoElement);
  }

  Future<Widget> initCamera() async {
    (await html.window.navigator.mediaDevices.enumerateDevices()).forEach((v) {
      print(v.deviceId);
      print(v.groupId);
      print(v.kind);
      print(v.label);
    });

    _videoStream = await html.window.navigator.mediaDevices.getUserMedia({
      'video': {
        'facingMode': {'exact': 'environment'}
      }
    });

    _htmlVideoElement
      ..srcObject = _videoStream
      ..play();

    _imageCapture = html.ImageCapture(_videoStream.getVideoTracks()[0]);

    return HtmlElementView(key: UniqueKey(), viewType: 'htmlVideoElement');
  }

  void disposeCamera() {
    _htmlVideoElement
      ..pause()
      ..srcObject = null;

    _videoStream.getTracks().forEach((track) {
      track.stop();
      _videoStream.removeTrack(track);
    });

    print('dispose camera');
  }

  Future<Uint8List> takePhoto() async {
    var photoBlob = await _imageCapture.takePhoto();
    var reader = html.FileReader();
    reader.readAsArrayBuffer(photoBlob);
    await reader.onLoadEnd.first;
    return reader.result;
  }
}
