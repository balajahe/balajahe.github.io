import 'package:flutter/material.dart';
import 'dart:typed_data';

class PhotoAccept extends StatelessWidget {
  final Uint8List _photoData;
  PhotoAccept(this._photoData);

  @override
  build(context) => Scaffold(
      appBar: AppBar(title: Text('Одобрить снимок')),
      body: Center(child: Image.memory(_photoData)),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.done),
        tooltip: 'Одобрить снимок',
        onPressed: () {
          Navigator.pop(context);
          Navigator.pop(context, _photoData);
        },
      ));
}
