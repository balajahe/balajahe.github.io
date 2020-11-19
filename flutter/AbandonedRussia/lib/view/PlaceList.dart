import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../model/Places.dart';

import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'PlaceAddEdit.dart';
import 'PlaceView.dart';
import 'AppMenu.dart';

const _TITLE_ALL = 'Все объекты';
const _TITLE_ONLY_MINE = 'Добавлены мной';

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
        title: Text(places.onlyMine ? _TITLE_ONLY_MINE : _TITLE_ALL),
        actions: [
          IconButton(
              tooltip: _TITLE_ONLY_MINE,
              icon: Icon(Icons.library_books),
              onPressed: () => places.refresh(onlyMine: true)),
          IconButton(
              tooltip: 'Обновить всё',
              icon: Icon(Icons.refresh),
              onPressed: () => places.refresh()),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Добавить объект',
        child: Icon(Icons.add),
        onPressed: _add,
      ),
      drawer: Drawer(
        child: AppMenu(),
      ),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: places.length + 1,
        itemBuilder: (context, i) => FutureBuilder(
            future: places.getByNum(i),
            builder: (context, snapshot) {
              if (snapshot.connectionState == DONE && snapshot.hasData) {
                var place = snapshot.data;
                return InkWell(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      PaddingText(place.title,
                          style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.bold),
                          top: 5),
                      //Separator(),
                      PaddingText(place.labelsAsString,
                          style: TextStyle(
                              fontSize: 12, fontStyle: FontStyle.italic)),
                      //Separator(),
                      PaddingText(place.description),
                      PhotoContainer(place, PhotoContainerMode.list),
                    ],
                  ),
                  onTap: () => _edit(place),
                );
              } else if (snapshot.hasError) {
                return WaitingOrError(error: snapshot.error);
              } else if (places.noMoreData) {
                return Container();
              } else {
                return WaitingOrError();
              }
            }),
      ),
    );
  }

  Future<void> _add() async {
    var newPlace = await Navigator.push(context,
        MaterialPageRoute(builder: (_) => PlaceAddEdit(PlaceEditMode.add)));
    if (newPlace != null) {
      _scrollController.animateTo(0,
          duration: Duration(milliseconds: 1000), curve: Curves.ease);
    }
  }

  void _edit(Place place) => Navigator.push(
      context, MaterialPageRoute(builder: (_) => PlaceView(place)));
}
