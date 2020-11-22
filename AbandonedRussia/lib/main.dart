import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'model/App.dart';
import 'model/Places.dart';
import 'model/Labels.dart';
import 'view/commonWidgets.dart';
import 'view/PlaceList.dart';

const _TITLE = 'Заброшенная Россия';

void main() {
  ErrorWidget.builder = (e) => ErrorScreen(e);
  runApp(AppWidget());
}

class AppWidget extends StatelessWidget {
  @override
  build(context) => MultiProvider(
        providers: [
          Provider<Places>(create: (context) => Places()),
          Provider<Labels>(create: (context) => Labels()),
        ],
        child: MaterialApp(
          title: _TITLE,
          theme: ThemeData(
            primarySwatch: Colors.blue,
            visualDensity: VisualDensity.adaptivePlatformDensity,
          ),
          home: _StartApp(),
        ),
      );
}

class _StartApp extends StatelessWidget {
  @override
  build(context) => FutureBuilder(
        future: App.init(),
        builder: (context, snapshot) =>
            (snapshot.connectionState == ConnectionState.done &&
                    !snapshot.hasError)
                ? PlaceList()
                : Scaffold(
                    appBar: AppBar(title: Text(_TITLE)),
                    body: ListView(
                      children: [WaitingOrError(error: snapshot.error)],
                    ),
                  ),
      );
}
