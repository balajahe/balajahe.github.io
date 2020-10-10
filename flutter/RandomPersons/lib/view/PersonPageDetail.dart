import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Person.dart';
import '../model/Persons.dart';
import './progressAndErrorWidgets.dart';

class PersonPageDetail extends StatefulWidget {
  final int _personIndex;

  PersonPageDetail(this._personIndex);

  @override
  createState() => _PersonPageDetailState(_personIndex);
}

class _PersonPageDetailState extends State<PersonPageDetail> {
  int _personIndex;
  Persons _persons;
  Person _person;
  bool _isLoading = false;

  _PersonPageDetailState(this._personIndex);

  @override
  build(context) {
    _persons = context.watch<Persons>();

    if (_personIndex < _persons.length) {
      _person = _persons.getByNum(_personIndex);
    }

    return Scaffold(
      backgroundColor: Color(0xAAFFFFFF),
      appBar: AppBar(
        title: Text(' Person Details'),
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
    // данные есть, берем из массива
    if (_personIndex < _persons.length) {
      return GestureDetector(
          onPanUpdate: (details) {
            if (details.delta.dx < 0) {
              //_prevPerson();
            } else if (details.delta.dx > 0) {
              //_nextPerson();
            }
          },
          child: Container(
            margin: EdgeInsets.all(40.0),
            color: Color(0xFFEEEEEE),
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
      // идет загрузка
    } else if (!_persons.isError) {
      return progerssWidget();
      // ошибка
    } else {
      return errorWidget(_persons.errorMsg, _persons.loadNextPart);
    }
  }

  void _prevPerson() {
    if (_personIndex > 0) {
      setState(() => _personIndex--);
    }
  }

  void _nextPerson() {
    setState(() => _personIndex++);
    if (_personIndex >= _persons.length && !_isLoading) {
      _isLoading = true;
      _persons.loadNextPart().then((_) => _isLoading = false);
    }
  }
}
