import 'dart:typed_data';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart' as phv;

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
            Container(height: 0, width: 10),
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
          child: Builder(builder: (context) {
            var completer = Completer<bool>();
            Image.memory(_photoData)
                .image
                .resolve(new ImageConfiguration())
                .addListener(ImageStreamListener(
              (info, sync) {
                var image = info.image;
                var media = MediaQuery.of(context).size;
                completer.complete(
                    media.width < media.height && image.width > image.height);
              },
            ));
            return FutureBuilder(
              future: completer.future,
              builder: (context, snapshot) => (snapshot.hasData)
                  ? (snapshot.data == true)
                      ? phv.PhotoView.customChild(
                          child: RotatedBox(
                              quarterTurns: 1, child: Image.memory(_photoData)))
                      : phv.PhotoView.customChild(
                          child: Image.memory(_photoData))
                  : Container(),
            );
          }),
        ),
      );
}
