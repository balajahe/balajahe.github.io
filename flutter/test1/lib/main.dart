import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './constants.dart';
import './model/Persons.dart';
import './view/PersonPageList.dart';

void main() {
  ErrorWidget.builder = (e) => Text(e.toString());

  runApp(ChangeNotifierProvider(
      create: (_) => Persons(),
      child: MaterialApp(
        title: TITLE + ' demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: PersonPageList(),
      )));
}
