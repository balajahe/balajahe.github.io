import 'dart:typed_data';
import 'package:flutter/material.dart';

abstract class CameraAbstract {
  Future<void> initCamera();

  void disposeCamera();

  Widget get previewWidget;

  Future<Uint8List> takePhoto();
}
