import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../model/CameraMobile.dart';
import '../model/CameraWebStub.dart'
    if (dart.library.html) '../model/CameraWeb.dart';

abstract class Camera {
  static Camera get instance => kIsWeb ? CameraWeb() : CameraMobile();

  Future<void> init();

  void play();

  void dispose();

  Widget get previewWidget;

  Future<Uint8List> takePhoto();
}
