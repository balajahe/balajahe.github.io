import 'package:AbandonedRussia/view/commonWidgets.dart';
import 'package:flutter/material.dart';

import '../settings.dart';
import '../model/Place.dart';

class PhotoContainer extends StatelessWidget {
  final Place _place;
  PhotoContainer(this._place);

  @override
  build(context) => Container(
        padding: EdgeInsets.all(2),
        child: Wrap(
          spacing: 1,
          runSpacing: 1,
          children: _place.photos
              .map<Widget>(
                (photo) => InkWell(
                  child: Container(
                    width: 0.0 + THUMBNAIL_WIDTH,
                    height: 0.0 + THUMBNAIL_WIDTH,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white, width: 1),
                      color: Colors.grey,
                    ),
                    child: photo.thumbnail != null
                        ? Image.memory(photo.thumbnail, fit: BoxFit.cover)
                        : Center(child: CircularProgressIndicator()),
                  ),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      fullscreenDialog: true,
                      builder: (_) => Scaffold(
                        // appBar: AppBar(
                        //     title: Text(_place.title != null
                        //         ? _place.title
                        //         : 'Новое фото')),
                        body: Center(
                          child: FutureBuilder(
                            future: photo.loadPhotoOrigin(),
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
