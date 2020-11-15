import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';

import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PlaceAddEdit.dart';
import '../view/PlaceView.dart';
import '../view/LabelsEdit.dart';

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
        child: _Menu(),
      ),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: places.length + 1,
        itemBuilder: (context, i) => FutureBuilder(
            future: places.getByNum(i),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                var place = snapshot.data;
                return InkWell(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(place.title,
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      Text(place.labelsAsString,
                          style: TextStyle(fontSize: 12)),
                      Padding(
                        padding: EdgeInsets.only(top: 3, bottom: 3),
                        child: Text(place.description),
                      ),
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

  void _add() async {
    var added = await Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => ChangeNotifierProvider<Place>(
                  create: (_) => Place(),
                  child: PlaceAddEdit(),
                )));
    if (added != null) {
      _scrollController.animateTo(0,
          duration: Duration(milliseconds: 1000), curve: Curves.ease);
    }
  }

  void _edit(Place place) {
    Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChangeNotifierProvider<Place>.value(
            value: place,
            child: PlaceView(place),
          ),
        ));
  }
}

class _Menu extends StatelessWidget {
  @override
  build(context) => ListView(
        children: [
          ListTile(
            title: Text('Редактировать метки'),
            onTap: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => LabelsEdit())),
          ),
        ],
      );
}
