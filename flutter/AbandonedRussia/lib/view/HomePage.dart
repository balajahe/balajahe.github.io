import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Places.dart';
import 'commonWidgets.dart';
import 'PlaceAddPage.dart';
import 'PlaceEditPage.dart';

class HomePage extends StatefulWidget {
  @override
  createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _scrollController = ScrollController();

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
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить место',
        child: Icon(Icons.add),
        onPressed: () async {
          var newPlace = await Navigator.push(
              context, MaterialPageRoute(builder: (context) => PlaceAddPage()));
          await places.addPlace(newPlace);
          _scrollController.jumpTo(0);
        },
      ),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: places.length + 1,
        itemBuilder: (context, i) {
          if (places.testPlaceByNum(i)) {
            var place = places.getPlaceByNum(i);
            return ListTile(
              title: Text(place.title),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => PlaceEditPage(place))),
            );
          } else if (places.noMorePlaces) {
            return null;
          } else if (places.hasError) {
            return Error(places.error);
          } else {
            return Waiting();
          }
        },
      ),
    );
  }
}
