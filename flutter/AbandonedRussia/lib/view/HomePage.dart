import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Places.dart';
import 'commonWidgets.dart';
import 'LoginPage.dart';
import 'PlaceAddPage.dart';
import 'PlaceEditPage.dart';

class HomePage extends StatelessWidget {
  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(TITLE),
        actions: [
          FlatButton(
            child: Text('Добавить'),
            onPressed: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => PlaceAddPage())),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить место',
        child: Icon(Icons.add),
        onPressed: () => Navigator.push(
            context, MaterialPageRoute(builder: (context) => PlaceAddPage())),
      ),
      body: _HomePageBody(),
    );
  }
}

class _HomePageBody extends StatelessWidget {
  @override
  build(context) {
    var places = context.watch<Places>();
    return ListView.builder(
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
        } else if (places.noMoreData) {
          return null;
        } else {
          return Waiting();
        }
      },
    );
  }
}
