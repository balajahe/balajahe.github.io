import 'dart:async';
import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';
import 'commonWidgets.dart';
import 'PhotoContainer.dart';

class PhotoView extends StatefulWidget {
  final Place _place;
  final int _photoIndex;
  final PhotoContainerMode _mode;
  PhotoView(this._place, this._photoIndex, this._mode);

  @override
  createState() => _PhotoViewState();
}

class _PhotoViewState extends State<PhotoView> {
  List<PlacePhoto> _photos;
  int _photoIndex;

  @override
  initState() {
    _photoIndex = widget._photoIndex;
    _photos = widget._place.photos;
    super.initState();
  }

  @override
  build(context) {
    var photo = _photos[_photoIndex];
    return GestureDetector(
      onPanUpdate: (details) {
        if (details.delta.dx > 20)
          _prev();
        else if (details.delta.dx < -20) _next();
      },
      child: Scaffold(
        floatingActionButton: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Container(width: 30, height: 0),
            (widget._mode == PhotoContainerMode.edit)
                ? FloatingActionButton(
                    tooltip: 'Удалить',
                    child: Icon(Icons.delete),
                    heroTag: 'delete',
                    mini: true,
                    onPressed: _del,
                  )
                : Container(height: 0),
            Expanded(child: Container(height: 0)),
            FloatingActionButton(
              tooltip: 'Предыдущее фото',
              child: Icon(Icons.arrow_back),
              heroTag: 'prev',
              mini: true,
              onPressed: _prev,
            ),
            Container(height: 0, width: 10),
            FloatingActionButton(
              tooltip: 'Следующее фото',
              child: Icon(Icons.arrow_forward),
              heroTag: 'next',
              mini: true,
              onPressed: _next,
            ),
          ],
        ),
        body: Center(
            child: FutureBuilder(
                future: photo.loadPhotoOrigin(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == DONE && !snapshot.hasError) {
                    var completer = Completer<bool>();
                    Image.memory(photo.origin)
                        .image
                        .resolve(new ImageConfiguration())
                        .addListener(ImageStreamListener(
                      (info, sync) {
                        var image = info.image;
                        var media = MediaQuery.of(context).size;
                        completer.complete(media.width < media.height &&
                            image.width > image.height);
                      },
                    ));
                    return FutureBuilder(
                        future: completer.future,
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            if (snapshot.data == true) {
                              return RotatedBox(
                                  quarterTurns: 1,
                                  child: Image.memory(photo.origin));
                            } else {
                              return Image.memory(photo.origin);
                            }
                          } else {
                            return Container();
                          }
                        });
                  } else {
                    return (snapshot.hasError)
                        ? Stack(
                            children: [
                              Center(child: Image.memory(photo.thumbnail)),
                              Padding(
                                  padding: EdgeInsets.all(30),
                                  child: SelectableText(
                                      snapshot.error.toString())),
                            ],
                          )
                        : WaitingOrError();
                  }
                })),
      ),
    );
  }

  void _prev() {
    if (_photoIndex > 0) setState(() => _photoIndex--);
  }

  void _next() {
    if (_photoIndex < _photos.length - 1) setState(() => _photoIndex++);
  }

  void _del() {
    widget._place.removePhoto(_photos[_photoIndex]);
    Navigator.pop(context);
  }
}
