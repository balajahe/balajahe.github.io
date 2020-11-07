import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'settings.dart';
import 'dao/Database.dart';
import 'model/Places.dart';
import 'model/Labels.dart';
import 'model/CameraAbstract.dart';
import 'view/commonWidgets.dart';
import 'view/PlaceList.dart';

void main() {
  ErrorWidget.builder = (e) => Scaffold(body: WaitingOrError(error: e));
  runApp(App());
}

class App extends StatelessWidget {
  @override
  build(context) => MultiProvider(
        providers: [
          ChangeNotifierProvider<Places>(create: (context) => Places()),
          Provider<Labels>(create: (context) => Labels()),
          Provider<CameraAbstract>(create: (context) => getCamera()),
        ],
        child: MaterialApp(
          title: APP_TITLE,
          theme: ThemeData(
            primarySwatch: Colors.blue,
            visualDensity: VisualDensity.compact, //.adaptivePlatformDensity,
          ),
          home: _StartApp(),
        ),
      );
}

class _StartApp extends StatelessWidget {
  @override
  build(context) => FutureBuilder(
      future: Database.connect(),
      builder: (context, snapshot) {
        print(snapshot.connectionState);
        print(snapshot.hasError);
        if (!snapshot.hasError &&
            snapshot.connectionState == ConnectionState.done) {
          return PlaceList();
        } else {
          return Scaffold(
              appBar: AppBar(title: Text(APP_TITLE)),
              body: SingleChildScrollView(
                  child: WaitingOrError(error: snapshot.error)));
        }
      });
}
