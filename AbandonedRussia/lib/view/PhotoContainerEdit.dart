import 'package:flutter/material.dart';

import '../model/Place.dart';
import 'PhotoContainer.dart';

class PhotoContainerEdit extends StatefulWidget {
  final Place _place;
  final PhotoContainerMode _mode;
  final int _fromIndex;
  PhotoContainerEdit(this._place, this._mode, [this._fromIndex]);

  @override
  createState() => _PhotoContainerEditState();
}

class _PhotoContainerEditState extends State<PhotoContainerEdit> {
  //bool _editing = false;

  @override
  build(context) =>
      PhotoContainer(widget._place, widget._mode, widget._fromIndex);
  // Stack(
  //       children: [
  //         PhotoContainer(widget._place, widget._mode, widget._fromIndex),
  //         (_editing)
  //             ? Row(
  //                 children: [
  //                   FloatingActionButton(
  //                     child: Icon(Icons.delete),
  //                     tooltip: 'Удалить',
  //                     mini: true,
  //                     onPressed: null,
  //                   ),
  //                   Expanded(child: Container(height: 0)),
  //                   FloatingActionButton(
  //                     child: Icon(Icons.arrow_left),
  //                     tooltip: 'Переместить влево',
  //                     mini: true,
  //                     onPressed: null,
  //                   ),
  //                   FloatingActionButton(
  //                     child: Icon(Icons.arrow_right),
  //                     tooltip: 'Переместить вправо',
  //                     mini: true,
  //                     onPressed: null,
  //                   ),
  //                 ],
  //               )
  //             : Container(),
  //       ],
  //    );
}
