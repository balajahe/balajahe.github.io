import 'dart:typed_data';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';

import '../model/Camera.dart';

class CameraMobile implements Camera {
  CameraController _camera;

  Future<void> init() async {
    WidgetsFlutterBinding.ensureInitialized();
    _camera = CameraController(
      (await availableCameras())[0],
      ResolutionPreset.max,
      enableAudio: false,
    );
    await _camera.initialize();
  }

  void play() {}

  void dispose() {
    _camera.dispose();
  }

  Widget get previewWidget => AspectRatio(
      aspectRatio: _camera.value.aspectRatio, child: CameraPreview(_camera));

  Future<Uint8List> takePhoto() async {
    var path = (await getTemporaryDirectory()).path + '/${DateTime.now()}.png';
    await _camera.takePicture(path);
    var file = File(path);
    var data = await file.readAsBytes();
    file.delete();
    return data;
  }
}
