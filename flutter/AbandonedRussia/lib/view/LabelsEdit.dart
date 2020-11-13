import 'package:flutter/material.dart';

import '../model/Labels.dart';

class LabelsEdit extends StatefulWidget {
  @override
  createState() => _LabelsEditState();
}

class _LabelsEditState extends State<LabelsEdit> {
  @override
  build(context) => Scaffold(
      appBar: AppBar(
        title: Text("Все метки"),
      ),
      body: TextField());
}
