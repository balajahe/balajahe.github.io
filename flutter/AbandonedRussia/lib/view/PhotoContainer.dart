import 'package:AbandonedRussia/view/commonWidgets.dart';
import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';

class PhotoContainer extends StatelessWidget {
  final Place _place;
  PhotoContainer(this._place);

  @override
  build(context) => Container(
        padding: EdgeInsets.all(5),
        child: Wrap(
          spacing: 5,
          runSpacing: 5,
          children: _place.photos
              .map<Widget>(
                (photo) => InkWell(
                  child: photo.thumbnail != null
                      ? Image.memory(photo.thumbnail)
                      : Container(
                          width: 0.0 + THUMBNAIL_WIDTH,
                          child: WaitingOrError()),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      fullscreenDialog: true,
                      builder: (_) => Scaffold(
                        appBar: AppBar(
                          title: Text(_place.title != null
                              ? _place.title
                              : 'Новое фото'),
                        ),
                        body: Center(
                          child: FutureBuilder(
                            future: _place.getPhotoOrigin(photo),
                            builder: (context, snapshot) =>
                                snapshot.connectionState ==
                                            ConnectionState.done &&
                                        !snapshot.hasError
                                    ? Image.memory(photo.origin != null
                                        ? photo.origin
                                        : photo.thumbnail)
                                    : WaitingOrError(error: snapshot.error),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      );
}
