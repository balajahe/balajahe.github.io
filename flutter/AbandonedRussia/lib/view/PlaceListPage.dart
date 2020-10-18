import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Places.dart';
import 'commonWidgets.dart';
import 'PlaceAddPage.dart';
import 'PlaceEditPage.dart';

class PlaceListPage extends StatefulWidget {
  @override
  createState() => _PlaceListPageState();
}

class _PlaceListPageState extends State<PlaceListPage> {
  final _scrollController = ScrollController();

  @override
  build(context) {
    var places = context.watch<Places>();
    return Scaffold(
      appBar: AppBar(
        title: Text(APP_TITLE),
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить место',
        child: Icon(Icons.add),
        onPressed: () async {
          var added = await Navigator.push(
              context, MaterialPageRoute(builder: (context) => PlaceAddPage()));
          if (added) {
            _scrollController.jumpTo(0);
          }
        },
      ),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: places.length + 1,
        itemBuilder: (context, i) {
          if (places.testByNum(i)) {
            var place = places.getByNum(i);
            return ListTile(
              title: Text(place.title),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => PlaceEditPage(place))),
            );
          } else if (places.noMoreData) {
            return null;
          } else if (places.hasError) {
            return Errors(places.error);
          } else {
            return Waiting();
          }
        },
      ),
    );
  }
}
