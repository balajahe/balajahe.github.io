import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/CameraAbstract.dart';
import '../view/commonWidgets.dart';

class PhotoTake extends StatelessWidget {
  @override
  build(context) {
    var camera = context.watch<CameraAbstract>();
    return FutureBuilder(
      future: camera.initCamera(),
      builder: (context, snapshot) => snapshot.hasData
          ? PhotoTakeForm(camera, snapshot.data)
          : WaitingOrError(error: snapshot.error),
    );
  }
}

class PhotoTakeForm extends StatefulWidget {
  final CameraAbstract _camera;
  final Widget _cameraPreview;

  PhotoTakeForm(this._camera, this._cameraPreview);

  @override
  createState() => _PhotoTakeFormState();
}

class _PhotoTakeFormState extends State<PhotoTakeForm> {
  Uint8List _photo;
  bool isWorking = false;

  @override
  build(context) {
    return Stack(children: [
      Scaffold(
        appBar: AppBar(title: Text('Добавить фото')),
        body: widget._cameraPreview,
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.camera_sharp),
          tooltip: 'Снимок!',
          onPressed: _takePhoto,
        ),
      ),
      isWorking ? WaitingOrError(transparent: true) : Container()
    ]);
  }

  Future<void> _takePhoto() async {
    setState(() => isWorking = true);
    _photo = await widget._camera.takePhoto();
    setState(() => isWorking = false);

    showDialog<void>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: Text('Одобрить фото'),
        content: Image.memory(_photo),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.cancel),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          IconButton(
            icon: Icon(Icons.save),
            onPressed: () {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                Navigator.pop(context);
                Navigator.pop(context, _photo);
              });
            },
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    widget._camera.disposeCamera();
    super.dispose();
  }
}
