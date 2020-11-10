import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../settings.dart';
import '../model/Places.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PlaceAdd.dart';
import '../view/PlaceView.dart';

const _ONLY_MINE_TITLE = 'Добавлены мной';

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
        title: Text(places.onlyMine ? _ONLY_MINE_TITLE : APP_TITLE),
        actions: [
          IconButton(
              icon: Icon(Icons.library_books),
              tooltip: _ONLY_MINE_TITLE,
              onPressed: () => places.refresh(onlyMine: true)),
          IconButton(
              icon: Icon(Icons.refresh),
              tooltip: 'Обновить все',
              onPressed: () => places.refresh()),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Новое место',
        child: Icon(Icons.add),
        onPressed: () async {
          var added = await Navigator.push(
              context, MaterialPageRoute(builder: (_) => PlaceAdd()));
          if (added != null) {
            _scrollController.animateTo(0,
                duration: Duration(milliseconds: 1000), curve: Curves.ease);
          }
        },
      ),
      body: ListView.builder(
        controller: _scrollController,
        itemCount: places.length + 1,
        itemBuilder: (context, i) => FutureBuilder(
            future: places.getByNum(i),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.done &&
                  snapshot.hasData) {
                var place = snapshot.data;
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 7,
                      children: [
                        PhotoContainer(place),
                        InkWell(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(place.title,
                                  style:
                                      TextStyle(fontWeight: FontWeight.bold)),
                              Text(place.labelsAsString,
                                  style: TextStyle(fontSize: 12)),
                            ],
                          ),
                          onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => PlaceView(place))),
                        ),
                      ],
                    ),
                    InkWell(
                      child: Text(place.description),
                      onTap: () => Navigator.push(context,
                          MaterialPageRoute(builder: (_) => PlaceView(place))),
                    ),
                  ],
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
}
