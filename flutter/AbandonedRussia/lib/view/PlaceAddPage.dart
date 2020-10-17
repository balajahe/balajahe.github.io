import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';

class PlaceAddPage extends StatefulWidget {
  @override
  createState() => _PlaceAddPageState();
}

class _PlaceAddPageState extends State<PlaceAddPage> {
  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Новое место'),
      ),
      body: null,
    );
  }
}
