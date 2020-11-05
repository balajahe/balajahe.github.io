import 'package:flutter/material.dart';
import 'dart:typed_data';

abstract class CameraInterface {
  Future<Widget> initCamera();

  void disposeCamera();

  Future<Uint8List> takePhoto();
}
