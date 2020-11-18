import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';

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
                      onPressed: null,
                    )
                  : Container(height: 0),
              Expanded(child: Container(height: 0)),
              FloatingActionButton(
                tooltip: 'Предыдущее фото',
                child: Icon(Icons.arrow_back),
                heroTag: 'prev',
                onPressed: _prev,
              ),
              Container(width: 10, height: 0),
              FloatingActionButton(
                tooltip: 'Следующее фото',
                child: Icon(Icons.arrow_forward),
                heroTag: 'next',
                onPressed: _next,
              ),
            ],
          ),
          body: FutureBuilder(
            future: photo.loadPhotoOrigin(),
            builder: (context, snapshot) =>
                (snapshot.connectionState == DONE && !snapshot.hasError)
                    ? Center(
                        child: Image.memory((photo.origin != null)
                            ? photo.origin
                            : photo.thumbnail),
                      )
                    : (snapshot.hasError)
                        ? Stack(
                            children: [
                              Center(child: Image.memory(photo.thumbnail)),
                              Padding(
                                  padding: EdgeInsets.all(30),
                                  child: Text(snapshot.error.toString())),
                            ],
                          )
                        : WaitingOrError(),
          )),
    );
  }

  void _prev() {
    if (_photoIndex > 0) setState(() => _photoIndex--);
  }

  void _next() {
    if (_photoIndex < _photos.length - 1) setState(() => _photoIndex++);
  }
}
