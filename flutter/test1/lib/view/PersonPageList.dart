import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:test1/view/PersonPageDetail.dart';

import '../constants.dart';
import '../model/Persons.dart';
import './PersonPageDetail.dart';

// не заморачивался с полосой прокрутки, хотя желательно
class PersonPageList extends StatelessWidget {
  @override
  build(context) {
    var persons = context.watch<Persons>();
    return Scaffold(
      appBar: AppBar(
        title: Text(TITLE + ' list'),
      ),
      body: Center(
        child: ListView.builder(
            itemCount: persons.length > 0 ? persons.length + 1 : 1,
            itemBuilder: (context, i) {
              if (i < persons.length) {
                // данные есть, берем из массива
                var person = persons.getByNum(i);
                return ListTile(
                  leading: Image.network(person.pictureThumbnail),
                  title: Text(person.name),
                  subtitle: Text(person.address),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      fullscreenDialog: true,
                      builder: (context) => PersonPageDetail(person),
                    ),
                  ),
                );
              } else {
                // данных не хватает, делаем запрос к серверу
                if (persons.error == '') {
                  persons.loadNextPart();
                  return Center(
                      child: Container(
                          margin: const EdgeInsets.only(top: 10.0),
                          child: CircularProgressIndicator()));
                } else {
                  return Column(children: [
                    Container(
                      margin: const EdgeInsets.only(top: 10.0),
                      child: Text(
                        persons.error,
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                    RaisedButton(
                      child: Text('Try again'),
                      onPressed: () => persons.loadNextPart(),
                    ),
                  ]);
                }
              }
            }),
      ),
    );
  }
}
