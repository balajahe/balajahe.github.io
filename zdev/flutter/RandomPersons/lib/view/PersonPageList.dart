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
  int _currPersonNum = -1;

  @override
  build(context) {
    var persons = context.watch<Persons>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Random person list'),
      ),
      body: Center(
        child: ListView.builder(
            controller: _scrollController,
            itemCount: persons.length + 1, //добавляем виджет загрузки
            itemBuilder: (context, i) {
              // данные загружены, берем из модели
              if (persons.testByNum(i)) {
                var person = persons.getByNum(i);
                return Container(
                    height: _ITEM_HEIGHT,
                    child: ListTile(
                      //tileColor: i == _currPersonNum ? Color(0xFFDDDDDD) : null, // тормозит!
                      leading: Image.network(person.pictureThumbnail),
                      title: Text(person.name),
                      subtitle: Text(person.address),
                      onTap: () async {
                        _currPersonNum =
                            await Navigator.of(context).push(PageRouteBuilder(
                          fullscreenDialog: true,
                          opaque: false,
                          pageBuilder: (_, __, ___) => PersonPageDetail(i),
                        ));
                        _scrollController.jumpTo(_currPersonNum * _ITEM_HEIGHT);
                      },
                    ));
                // загружаем новую порцию данных
              } else {
                if (!persons.isError) {
                  persons.loadNextPart();
                  return progerssWidget();
                } else {
                  return errorWidget(persons.errorMsg, persons.loadNextPart);
                }
              }
            }),
      ),
    );
  }
}
