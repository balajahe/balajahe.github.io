import 'dart:math';
import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';
import 'PhotoView.dart';

enum PhotoContainerMode { list, view, edit }

class PhotoContainer extends StatelessWidget {
  final Place _place;
  final PhotoContainerMode _mode;
  final int _fromIndex;
  PhotoContainer(this._place, this._mode, [this._fromIndex = 0]);

  @override
  build(context) {
    var photos = _place.photos;
    var toIndex = (_mode == PhotoContainerMode.list)
        ? min(THUMBNAIL_COUNT_IN_LIST, _place.photos.length)
        : _place.photos.length;
    return Container(
      padding: EdgeInsets.only(top: 2, left: 2, right: 2),
      child: Wrap(
        spacing: 1,
        runSpacing: 1,
        children: [for (var i = _fromIndex; i < toIndex; i += 1) i]
            .map<Widget>(
              (photoIndex) => InkWell(
                child: Container(
                  width: 0.0 + THUMBNAIL_SIZE,
                  height: 0.0 + THUMBNAIL_SIZE,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 1),
                    color: Colors.grey,
                  ),
                  child: photos[photoIndex].thumbnail != null
                      ? Image.memory(photos[photoIndex].thumbnail,
                          fit: BoxFit.cover)
                      : Center(child: CircularProgressIndicator()),
                ),
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => PhotoView(_place, photoIndex, _mode))),
              ),
            )
            .toList(),
      ),
    );
  }
}
