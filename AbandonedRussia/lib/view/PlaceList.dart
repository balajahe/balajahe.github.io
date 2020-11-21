import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
        itemCount: places.length + 1, //добавляем виджет загрузки
        itemBuilder: (context, i) {
          // данные загружены, берем из модели
          if (places.testByNum(i)) {
            var place = places.getByNum(i);
            return InkWell(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  PaddingText(
                    place.title,
                    top: 5,
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  PaddingText(
                    place.labelsAsString,
                    style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
                  ),
                  PaddingText(place.description),
                  PhotoContainer(place, PhotoContainerMode.list),
                ],
              ),
              onTap: () => _edit(place),
            );
            // загружаем новую порцию данных
          } else if (places.error != null) {
            return WaitingOrError(error: places.error);
          } else if (places.noMoreData) {
            return Container();
          } else {
            places.loadNextPart();
            return WaitingOrError();
          }
        },
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
