import 'package:flutter/material.dart';
import 'dart:typed_data';

abstract class CameraAbstract {
  Future<Widget> initCamera();

  void disposeCamera();

  Future<Uint8List> takePhoto();
}
