import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'model/App.dart';
import 'model/Places.dart';
import 'model/Labels.dart';
import 'model/Camera.dart';
import 'model/Location.dart';
import 'view/commonWidgets.dart';
import 'view/PlaceList.dart';

const _TITLE = 'Заброшенные места';

void main() {
  ErrorWidget.builder = (e) => WaitingOrError(error: e);
  runApp(AppWidget());
}

class AppWidget extends StatelessWidget {
  @override
  build(context) => MultiProvider(
        providers: [
          ChangeNotifierProvider<Places>(create: (context) => Places()),
          Provider<Labels>(create: (context) => Labels()),
          Provider<Camera>(create: (context) => Camera.instance),
          Provider<Location>(create: (context) => Location()),
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
