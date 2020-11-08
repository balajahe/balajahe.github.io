import 'package:flutter/material.dart';
import 'dart:typed_data';

import '../model/CameraAbstract.dart';

class CameraWeb implements CameraAbstract {
  Future<Widget> initCamera() => Future(() => Container());

  void disposeCamera() {}

  Future<Uint8List> takePhoto() => Future(() => Uint8List(0));
}
