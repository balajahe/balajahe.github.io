import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'constants.dart';
import 'model/Places.dart';
import 'view/commonWidgets.dart';
import 'view/HomePage.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  build(context) => ChangeNotifierProvider(
        create: (context) => Places(),
        child: MaterialApp(
          title: TITLE,
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
  build(context) {
    var placesConnect =
        context.select<Places, Function>((places) => places.connect);
    return FutureBuilder(
        future: placesConnect(),
        builder: (context, snapshot) {
          print(snapshot.connectionState);
          print(snapshot.hasError);
          if (!snapshot.hasError &&
              snapshot.connectionState == ConnectionState.done) {
            return HomePage();
          } else {
            return Scaffold(
              appBar: AppBar(title: Text(TITLE)),
              body: ListView(
                  children: snapshot.hasError
                      ? [Error(snapshot.error)]
                      : [Waiting()]),
            );
          }
        });
  }
}
