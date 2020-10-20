import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Places.dart';
import '../view/commonWidgets.dart';
import '../view/PlaceAdd.dart';
import '../view/PlaceView.dart';

class PlaceList extends StatefulWidget {
  @override
  createState() => _PlaceListState();
}

class _PlaceListState extends State<PlaceList> {
  final _scrollController = ScrollController();

  @override
  build(context) {
    var places = context.watch<Places>();
    return Scaffold(
      appBar: AppBar(
        title: Text(APP_TITLE),
        actions: [
          IconButton(
            icon: Icon(Icons.my_library_add),
            tooltip: 'Добавленные мной',
            onPressed: () => places.refresh(onlyMy: true),
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            tooltip: 'Обновить все',
            onPressed: () => places.refresh(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить',
        child: Icon(Icons.add),
        onPressed: () async {
          var added = await Navigator.push(
              context, MaterialPageRoute(builder: (context) => PlaceAdd()));
          if (added) {
            _scrollController.animateTo(0,
                duration: Duration(milliseconds: 1000), curve: Curves.ease);
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
              subtitle: Text(place.description),
              onTap: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => PlaceView(place))),
            );
          } else if (places.hasError) {
            return Errors(places.error);
          } else if (places.noMoreData) {
            return null;
          } else {
            return Waiting();
          }
        },
      ),
    );
  }
}
