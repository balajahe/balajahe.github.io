import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'constants.dart';
import 'view/CommonWidgets.dart';
import 'model/Places.dart';
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
        home: StartApp(),
      ));
}

class StartApp extends StatelessWidget {
  @override
  build(context) {
    var places = context.watch<Places>();
    return FutureBuilder(
        future: places.connect(),
        builder: (context, snapshot) {
          print(snapshot.hasError);
          print(snapshot.connectionState);
          if (!snapshot.hasError &&
              snapshot.connectionState == ConnectionState.done) {
            return HomePage();
          } else {
            return Scaffold(
                appBar: AppBar(title: Text(TITLE)),
                body: snapshot.hasError
                    ? Center(child: SelectableText(snapshot.error.toString()))
                    : ListView(children: [Waiting()]));
          }
        });
  }
}
