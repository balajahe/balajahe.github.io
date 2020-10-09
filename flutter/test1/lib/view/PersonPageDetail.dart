import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Persons.dart';

class PersonPageDetail extends StatelessWidget {
  @override
  build(context) {
    var persons = context.watch<Persons>();
    return Scaffold(
      appBar: AppBar(
        title: Text(TITLE + ' detail'),
      ),
      body: Center(
        child: ListView.builder(
            itemCount: persons.length > 0 ? persons.length + 1 : 1,
            scrollDirection: Axis.horizontal,
            itemBuilder: (context, i) {
              if (i < persons.length) {
                var person = persons.getByNum(i);
                return ListTile(
                  leading: Image.network(person.pictureThumbnail),
                  title: Text(person.name),
                  subtitle: Text(person.address),
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
