import 'dart:typed_data';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';

import 'CameraAbstract.dart';

class CameraFlutter extends ChangeNotifier implements CameraAbstract {
  CameraController _camera;

  Future<Widget> initCamera() async {
    WidgetsFlutterBinding.ensureInitialized();
    _camera =
        CameraController((await availableCameras())[0], ResolutionPreset.high);
    await _camera.initialize();
    return AspectRatio(
        aspectRatio: _camera.value.aspectRatio, child: CameraPreview(_camera));
  }

  void disposeCamera() {
    _camera.dispose();
  }

  Future<Uint8List> takePhoto() async {
    var path = (await getTemporaryDirectory()).path + '/${DateTime.now()}.png';
    print(path);
    await _camera.takePicture(path);
    var file = File(path);
    var data = await file.readAsBytes();
    await file.delete();
    return data;
  }
}
