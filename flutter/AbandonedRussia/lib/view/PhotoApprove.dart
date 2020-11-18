import 'dart:typed_data';
import 'dart:math';
import 'package:flutter/material.dart';

class PhotoApprove extends StatelessWidget {
  final Uint8List _photoData;
  PhotoApprove(this._photoData);

  @override
  build(context) => Scaffold(
        appBar: AppBar(title: Text('Одобрить фото')),
        floatingActionButton: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            FloatingActionButton(
              tooltip: 'Удалить фото',
              heroTag: 'delete',
              child: Icon(Icons.clear),
              mini: true,
              onPressed: () => Navigator.pop(context),
            ),
            Container(width: 10, height: 0),
            FloatingActionButton(
              tooltip: 'Одобрить фото',
              heroTag: 'save',
              child: Icon(Icons.done),
              mini: true,
              onPressed: () => Navigator.pop(context, true),
            ),
          ],
        ),
        body: Center(
          // если телефон повернут, желательно и превью поворачивать, доделать
          child: (1 == 1)
              ? Image.memory(_photoData)
              : Transform(
                  transform: Matrix4.rotationX(pi / 2),
                  alignment: Alignment.center,
                  child: Image.memory(_photoData),
                ),
        ),
      );
}
