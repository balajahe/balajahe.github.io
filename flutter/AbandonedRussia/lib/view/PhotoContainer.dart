import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';

enum PhotoContainerMode { list, view, add, edit }

class PhotoContainer extends StatelessWidget {
  final Place _place;
  final PhotoContainerMode _mode;
  final int _fromIndex;

  PhotoContainer(
    this._place, [
    this._mode = PhotoContainerMode.view,
    this._fromIndex = 0,
  ]);

  @override
  build(context) => Container(
        padding: EdgeInsets.all(2),
        child: Wrap(
          spacing: 1,
          runSpacing: 1,
          children: _photosToShow()
              .map<Widget>(
                (photo) => InkWell(
                  child: Container(
                    width: 0.0 + THUMBNAIL_DISPLAY_HEIGHT,
                    height: 0.0 + THUMBNAIL_DISPLAY_HEIGHT,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white, width: 1),
                      color: Colors.grey,
                    ),
                    child: photo.thumbnail != null
                        ? Image.memory(photo.thumbnail, fit: BoxFit.cover)
                        : Center(child: CircularProgressIndicator()),
                  ),
                  onTap: () => _showOrigin(context, photo),
                ),
              )
              .toList(),
        ),
      );

  List<PlacePhoto> _photosToShow() {
    if (_mode == PhotoContainerMode.list)
      return _place.photos.take(THUMBNAIL_COUNT_IN_LIST).toList();
    else if (_fromIndex != 0)
      return _place.photos.sublist(_fromIndex);
    else
      return _place.photos;
  }

  void _showOrigin(context, photo) {
    Navigator.push(
      context,
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (_) => Scaffold(
          body: Center(
            child: FutureBuilder(
              future: photo.loadPhotoOrigin(),
              builder: (context, snapshot) =>
                  snapshot.connectionState == DONE && !snapshot.hasError
                      ? GestureDetector(
                          onPanUpdate: (details) {
                            if (details.delta.dx > 0) {
                              // swiping in right direction
                            }
                          },
                          child: Image.memory((photo.origin != null)
                              ? photo.origin
                              : photo.thumbnail),
                        )
                      : WaitingOrError(error: snapshot.error),
            ),
          ),
        ),
      ),
    );
  }
}

class _ShowOrigin extends StatefulWidget {
  final List<PlacePhoto> _photos;
  final int _index;
  _ShowOrigin(this._photos, this._index);

  @override
  createState() => _ShowOriginState();
}

class _ShowOriginState extends State<_ShowOrigin> {
  int _index;

  @override
  initState() {
    _index = widget._index;
    super.initState();
  }

  @override
  build(context) {
    var photo = widget._photos[_index];
    return GestureDetector(
      onPanUpdate: (details) {
        if (details.delta.dx > 0 && _index < widget._photos.length) {
          setState(() => _index++);
        } else if (details.delta.dx < 0 && _index > 0) {
          setState(() => _index--);
        }
      },
      child:
          Image.memory((photo.origin != null) ? photo.origin : photo.thumbnail),
    );
  }
}
