import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:test1/view/PersonPageDetail.dart';

import '../constants.dart';
import '../model/Persons.dart';
import './PersonPageDetail.dart';

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
            scrollDirection: Axis.vertical,
            itemBuilder: (context, i) {
              if (i < persons.length) {
                var person = persons.getByNum(i);
                return ListTile(
                  leading: Image.network(person.pictureThumbnail),
                  title: Text(person.name),
                  subtitle: Text(person.address),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => PersonPageDetail(),
                    ),
                  ),
                );
              } else {
                if (persons.error == '') {
                  persons.loadNextPart();
                  return Center(child: CircularProgressIndicator());
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
