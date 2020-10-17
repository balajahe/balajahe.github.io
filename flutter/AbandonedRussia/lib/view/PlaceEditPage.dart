import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Places.dart';

class PlaceEditPage extends StatelessWidget {
  final String id;

  PlaceEditPage(this.id);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Место #$id'),
      ),
      body: null,
    );
  }
}
