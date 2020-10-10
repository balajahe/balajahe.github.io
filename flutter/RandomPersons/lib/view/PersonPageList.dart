import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Persons.dart';
import './PersonPageDetail.dart';
import './progressAndErrorWidgets.dart';

// не заморачивался с полосой прокрутки, хотя наверное желательно
class PersonPageList extends StatelessWidget {
  @override
  build(context) {
    var persons = context.watch<Persons>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Person List'),
      ),
      body: Center(
        child: ListView.builder(
            itemCount: persons.length + 1,
            itemBuilder: (context, i) {
              if (i < persons.length) {
                // данные есть, берем из массива
                var person = persons.getByNum(i);
                return ListTile(
                  leading: Image.network(person.pictureThumbnail),
                  title: Text(person.name),
                  subtitle: Text(person.address),
                  onTap: () => Navigator.of(context).push(
                    PageRouteBuilder(
                      fullscreenDialog: true,
                      opaque: false,
                      pageBuilder: (_, __, ___) => PersonPageDetail(i),
                    ),
                  ),
                );
              } else if (!persons.isError) {
                // идет загрузка
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
