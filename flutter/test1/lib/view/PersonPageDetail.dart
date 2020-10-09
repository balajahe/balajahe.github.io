import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../constants.dart';
import '../model/Person.dart';

class PersonPageDetail extends StatelessWidget {
  Person _person;

  PersonPageDetail(this._person);

  @override
  build(context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(TITLE + ' detail'),
        ),
        body: Center(
          child: ListView(children: [
            Image.network(_person.pictureLarge),
            ListTile(
                title: Text(
              _person.name,
              style: TextStyle(fontSize: 25),
            )),
            ListTile(
              title: Text('Address:'),
              subtitle: Text(_person.address),
            ),
            ListTile(
              title: Text('Email:'),
              subtitle: Text(_person.email),
            ),
            ListTile(
              title: Text('Phone:'),
              subtitle: Text(_person.phone),
            ),
          ]),
        ));
  }
}
