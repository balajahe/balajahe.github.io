import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../model/CameraMobile.dart';
import '../model/CameraWebStub.dart'
    if (dart.library.html) '../model/CameraWeb.dart';

abstract class Camera {
  static Camera factory() => kIsWeb ? CameraWeb() : CameraMobile();

  Future<void> init();

  void dispose();

  Widget get previewWidget;

  Future<Uint8List> takePhoto();
}
