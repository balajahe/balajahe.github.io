import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:html' as html;

class CameraProvider extends ChangeNotifier {
  html.MediaStream _videoStream;
  html.VideoElement _htmlVideoElement;
  Widget _videoElement;
  html.ImageCapture _imageCapture;
  bool _isCapturing = false;
}
