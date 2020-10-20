import 'package:flutter/material.dart';
import 'dart:html';
import 'dart:ui' as ui;

import '../view/commonWidgets.dart';

class TakePhoto extends StatefulWidget {
  @override
  createState() => _TakePhotoState();
}

class _TakePhotoState extends State<TakePhoto> {
  Widget _cameraWidget;
  VideoElement _cameraVideoElement;

  @override
  build(context) => Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      body: FutureBuilder(
        future: _initCamera(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Waiting(); //_cameraWidget;
          } else {
            return Waiting();
          }
        },
      ));

  Future<void> _initCamera() async {
    _cameraVideoElement = VideoElement();
    // ui.platformViewRegistry.registerViewFactory(
    //     'cameraVideoElement', (int viewId) => _cameraVideoElement);
    // _cameraWidget =
    //     HtmlElementView(key: UniqueKey(), viewType: 'cameraVideoElement');
  }
}
