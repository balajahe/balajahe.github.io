import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/Camera.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PhotoApprove.dart';

class PhotoTake extends StatelessWidget {
  @override
  build(context) => FutureBuilder(
        future: context.watch<Camera>().init(),
        builder: (context, snapshot) =>
            (snapshot.connectionState == DONE && !snapshot.hasError)
                ? _PhotoTakeForm()
                : WaitingOrError(error: snapshot.error),
      );
}

class _PhotoTakeForm extends StatefulWidget {
  @override
  createState() => _PhotoTakeFormState();
}

class _PhotoTakeFormState extends State<_PhotoTakeForm> {
  Place _place;
  Camera _camera;
  int _fromIndex;

  @override
  initState() {
    _fromIndex = context.read<Place>().photos.length;
    super.initState();
  }

  @override
  build(context) {
    _place = context.watch<Place>();
    _camera = context.watch<Camera>();

    return Scaffold(
      appBar: AppBar(title: Text('Добавить фото')),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.camera_sharp),
        tooltip: 'Снимок!',
        onPressed: _takePhoto,
      ),
      body: Stack(children: [
        Center(child: _camera.previewWidget),
        PhotoContainer(_place, PhotoContainerMode.add, _fromIndex),
      ]),
    );
  }

  Future<void> _takePhoto() async {
    startWaiting(context);
    var photo = await _camera.takePhoto();
    stopWaiting(context);

    var approved = await Navigator.push(
        context, MaterialPageRoute(builder: (_) => PhotoApprove(photo)));
    if (approved != null) {
      _place.addPhoto(PlacePhoto(origin: photo));
    }
  }

  @override
  void dispose() {
    _camera.dispose();
    super.dispose();
  }
}
