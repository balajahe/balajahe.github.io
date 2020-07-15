import 'package:flutter/material.dart';
import './VideoClient.dart';
import './VideoServer.dart';

class VideoTestPage extends StatelessWidget {
  @override build(context) => Scaffold(
    appBar: AppBar(title: Text('Local test')),
    body: Column(
      mainAxisAlignment : MainAxisAlignment.spaceEvenly,
      children: [
        Expanded(child: VideoClientWidget('127.0.0.1:4040')),
        Container(height: 2, color: Colors.blue),
        Expanded(child: VideoServerWidget(4040)),
      ]
    ),
  );
}
