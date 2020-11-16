import 'dart:typed_data';
import 'package:flutter/material.dart';

import 'Camera.dart';

class CameraWeb implements Camera {
  Future<void> init() => Future(() {});

  void play() {}

  void dispose() {}

  Widget get previewWidget => Container();

  Future<Uint8List> takePhoto() => Future(() => Uint8List(0));
}
