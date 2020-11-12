import 'dart:typed_data';
import 'package:flutter/material.dart';

class PhotoApprove extends StatelessWidget {
  final Uint8List photoData;
  PhotoApprove(this.photoData);

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Одобрить фото')),
        floatingActionButton: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            FloatingActionButton(
              child: Icon(Icons.clear),
              tooltip: 'Удалить фото',
              heroTag: 'delete',
              onPressed: () => Navigator.pop(context),
            ),
            Container(width: 10, height: 0),
            FloatingActionButton(
              child: Icon(Icons.done),
              tooltip: 'Одобрить фото',
              heroTag: 'save',
              onPressed: () => Navigator.pop(context, true),
            ),
          ],
        ),
        body: Center(
          child: Image.memory(photoData),
        ),
      );
}
