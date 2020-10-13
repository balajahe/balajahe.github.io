import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Person.dart';
import '../model/Persons.dart';
import './progressAndErrorWidgets.dart';

class PersonPageDetail extends StatefulWidget {
  final int _personNum;
  PersonPageDetail(this._personNum);
  @override
  createState() => _PersonPageDetailState(_personNum);
}

class _PersonPageDetailState extends State<PersonPageDetail> {
  int _personNum;
  Persons _persons;
  Person _person;

  _PersonPageDetailState(this._personNum);

  @override
  build(context) {
    _persons = context.watch<Persons>();

    if (_persons.testByNum(_personNum)) {
      _person = _persons.getByNum(_personNum);
    }

    return Scaffold(
      backgroundColor: Color(0xBBFFFFFF),
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.close),
          tooltip: 'close details',
          onPressed: () => Navigator.pop(context, _personNum),
        ),
        title: Text(' Person #$_personNum'),
        actions: [
          IconButton(
            icon: Icon(Icons.arrow_back),
            tooltip: 'previous person',
            onPressed: () => _prevPerson(),
          ),
          IconButton(
            icon: Icon(Icons.arrow_forward),
            tooltip: 'next person',
            onPressed: () => _nextPerson(),
          ),
        ],
      ),
      body: _showBody(),
    );
  }

  Widget _showBody() {
    // данные есть, берем из модели
    if (_persons.testByNum(_personNum)) {
      return GestureDetector(
          onHorizontalDragUpdate: (details) {
            if (details.delta.dx > 10) {
              _prevPerson();
            } else if (details.delta.dx < -10) {
              _nextPerson();
            }
          },
          child: Container(
            margin: EdgeInsets.all(40.0),
            decoration: BoxDecoration(
              color: Color(0xFFEEEEEE),
              borderRadius: BorderRadius.all(Radius.circular(20)),
            ),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
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
      // загружаем новую порцию данных
    } else if (!_persons.isError) {
      return progerssWidget();
    } else {
      return errorWidget(_persons.errorMsg, _persons.loadNextPart);
    }
  }

  void _prevPerson() {
    if (_personNum > 0) {
      setState(() => _personNum--);
    }
  }

  void _nextPerson() {
    if (!_persons.isLoading) {
      setState(() => _personNum++);
      if (!_persons.testByNum(_personNum)) {
        _persons.loadNextPart();
      }
    }
  }
}
