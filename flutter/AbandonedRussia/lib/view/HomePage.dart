import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Places.dart';
import 'LoginPage.dart';
import 'PlaceAddPage.dart';
import 'PlaceEditPage.dart';

class HomePage extends StatefulWidget {
  @override
  createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  String userName;

  @override
  build(context) {
    var places = context.watch<Places>();
    return Scaffold(
      appBar: AppBar(
        title: Text(TITLE),
        actions: [
          FlatButton(
            child: Text('Добавить'),
            onPressed: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => PlaceAddPage())),
          ),
          FlatButton(
            child: Text('Войти'),
            onPressed: () => Navigator.push(
                context, MaterialPageRoute(builder: (context) => LoginPage())),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: places.length + 1,
        itemBuilder: (context, i) {
          if (places.testById(i)) {
            var place = places.getById(i);
            return ListTile(
              title: Text(place.title),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => PlaceEditPage(place.id))),
            );
          } else if (!places.noMoreData) {
            return Container(
                margin: EdgeInsets.only(top: 15),
                child: Center(child: CircularProgressIndicator()));
          } else {
            return null;
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить место',
        child: Icon(Icons.add),
        onPressed: () => Navigator.push(
            context, MaterialPageRoute(builder: (context) => PlaceAddPage())),
      ),
    );
  }
}
