import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'constants.dart';
import 'dao/Database.dart';
import 'model/Places.dart';
import 'model/Labels.dart';
import 'view/commonWidgets.dart';
import 'view/PlaceList.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  build(context) => MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (context) => Places()),
          ChangeNotifierProvider(create: (context) => Labels()),
        ],
        child: MaterialApp(
          title: APP_TITLE,
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
            body: ListView(
                children:
                    snapshot.hasError ? [Errors(snapshot.error)] : [Waiting()]),
          );
        }
      });
}
