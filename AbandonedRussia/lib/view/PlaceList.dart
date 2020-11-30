import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import 'commonWidgets.dart';
import 'PhotoContainer.dart';
import 'PlaceAddEdit.dart';
import 'PlaceView.dart';
import 'AppMenu.dart';

class PlaceList extends StatefulWidget {
  @override
  createState() => _PlaceListState();
}

class _PlaceListState extends State<PlaceList> {
  Places _places;
  final _scrollController = ScrollController();
  final _searchString = TextEditingController();

  @override
  build(context) {
    _places = context.watch<Places>();
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchString,
          decoration: InputDecoration(
            hintText: "Найти...",
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white60),
          ),
          cursorColor: Colors.white,
          onSubmitted: (_) => _search(),
        ),
        actions: [
          IconButton(
              tooltip: 'Мои объекты',
              icon: Icon(Icons.my_library_books),
              onPressed: () => _refresh(onlyMine: true)),
          IconButton(
              tooltip: 'Все объекты',
              icon: Icon(Icons.refresh),
              onPressed: () => _refresh()),
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
      body: StreamBuilder(
        stream: _places.stream,
        builder: (context, snapshot) => ListView.builder(
          controller: _scrollController,
          itemCount: _places.length + 1, //добавляем виджет загрузки
          itemBuilder: (context, i) {
            // данные загружены, берем из модели
            if (_places.testByNum(i)) {
              var place = _places.getByNum(i);
              return InkWell(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    PaddingText(
                      place.title,
                      style:
                          TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      top: 3,
                    ),
                    PaddingText(
                      place.labelsAsString,
                      style:
                          TextStyle(fontSize: 12, fontStyle: FontStyle.italic),
                    ),
                    PaddingText(place.description),
                    PhotoContainer(place, PhotoContainerMode.list),
                    Container(height: 4),
                  ],
                ),
                onTap: () => _edit(place),
              );
              // загружаем новую порцию данных
            } else if (snapshot.hasError) {
              return WaitingOrError(error: snapshot.error);
            } else if (_places.noMoreData) {
              return Container();
            } else {
              return WaitingOrError();
            }
          },
        ),
      ),
    );
  }

  void _refresh({bool onlyMine = false}) {
    _searchString.text = '';
    _places.refresh(onlyMine: onlyMine, searchString: null);
  }

  void _search() {
    _places.refresh(onlyMine: false, searchString: _searchString.text);
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
