import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Persons.dart';
import './PersonPageDetail.dart';
import './progressAndErrorWidgets.dart';

const double _ITEM_HEIGHT = 60.0;

class PersonPageList extends StatefulWidget {
  @override
  createState() => _PersonPageListState();
}

class _PersonPageListState extends State<PersonPageList> {
  final _scrollController = ScrollController();

  @override
  build(context) {
    var persons = context.watch<Persons>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Person List'),
      ),
      body: Center(
        child: ListView.builder(
            controller: _scrollController,
            itemCount: persons.length + 1,
            itemBuilder: (context, i) {
              // данные есть, берем из массива
              if (i < persons.length) {
                var person = persons.getByNum(i);
                return Container(
                    height: _ITEM_HEIGHT,
                    child: ListTile(
                      leading: Image.network(person.pictureThumbnail),
                      title: Text(person.name),
                      subtitle: Text(person.address),
                      onTap: () async {
                        var newPersonIndex =
                            await Navigator.of(context).push(PageRouteBuilder(
                          fullscreenDialog: true,
                          opaque: false,
                          pageBuilder: (_, __, ___) => PersonPageDetail(i),
                        ));
                        _scrollController.jumpTo(newPersonIndex * _ITEM_HEIGHT);
                      },
                    ));
                // идет загрузка
              } else if (!persons.isError) {
                persons.loadNextPart();
                return progerssWidget();
                // ошибка
              } else {
                return errorWidget(persons.errorMsg, persons.loadNextPart);
              }
            }),
      ),
    );
  }
}
