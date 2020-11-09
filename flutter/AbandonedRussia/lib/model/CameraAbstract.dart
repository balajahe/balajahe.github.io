import 'package:flutter/material.dart';
import 'dart:typed_data';

abstract class CameraAbstract {
  Future<void> initCamera();

  void disposeCamera();

  Widget get previewWidget;

  Future<Uint8List> takePhoto();
}
