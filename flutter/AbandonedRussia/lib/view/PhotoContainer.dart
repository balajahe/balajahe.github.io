import 'dart:math';
import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../view/commonWidgets.dart';

enum PhotoContainerMode { list, view, edit }

class PhotoContainer extends StatelessWidget {
  final Place _place;
  final PhotoContainerMode _mode;
  final int _fromIndex;
  int _toIndex;

  PhotoContainer(this._place, this._mode, [this._fromIndex = 0]) {
    _toIndex = (_mode == PhotoContainerMode.list)
        ? min(THUMBNAIL_COUNT_IN_LIST, _place.photos.length)
        : _place.photos.length;
  }

  @override
  build(context) {
    var photos = _place.photos;
    return Container(
      padding: EdgeInsets.all(2),
      child: Wrap(
        spacing: 1,
        runSpacing: 1,
        children: [for (var i = _fromIndex; i < _toIndex; i += 1) i]
            .map<Widget>(
              (index) => InkWell(
                child: Container(
                  width: 0.0 + THUMBNAIL_DISPLAY_HEIGHT,
                  height: 0.0 + THUMBNAIL_DISPLAY_HEIGHT,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 1),
                    color: Colors.grey,
                  ),
                  child: photos[index].thumbnail != null
                      ? Image.memory(photos[index].thumbnail, fit: BoxFit.cover)
                      : Center(child: CircularProgressIndicator()),
                ),
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => _ShowOrigin(photos, index))),
              ),
            )
            .toList(),
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
    return Scaffold(
      body: Center(
        child: FutureBuilder(
          future: photo.loadPhotoOrigin(),
          builder: (context, snapshot) => snapshot.connectionState == DONE &&
                  !snapshot.hasError
              ? GestureDetector(
                  onPanUpdate: (details) {
                    if (details.delta.dx > 20 && _index > 0) {
                      setState(() => _index--);
                    } else if (details.delta.dx < -20 &&
                        _index < widget._photos.length - 1) {
                      setState(() => _index++);
                    }
                  },
                  child: Image.memory(
                      (photo.origin != null) ? photo.origin : photo.thumbnail),
                )
              : WaitingOrError(error: snapshot.error),
        ),
      ),
    );
  }
}
