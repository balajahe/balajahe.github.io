import 'package:flutter/material.dart';

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
                  child: Image.memory(photo.thumbnail),
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
                            child: Image.memory(photo.origin != null
                                ? photo.origin
                                : photo.thumbnail)),
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      );
}
