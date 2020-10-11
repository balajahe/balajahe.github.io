import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../constants.dart';
import './Person.dart';

// Оборачивается в Provider, предоставляет данные всем страницам приложения
class Persons with ChangeNotifier {
  final List<Person> _persons = [];
  String _error;

  int get length => _persons.length;
  Person getByNum(int i) => _persons[i];

  bool get isError => _error != null;
  String get errorMsg => _error;

  Future<void> loadNextPart() async {
    _error = null;
    notifyListeners();
    try {
      var response = await http.get(PERSONS_URL, headers: {
        'user-agent':
            'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
      });
      if (response.statusCode != 200) {
        throw response.body.toString();
      }
      jsonDecode(response.body)['results']
          .forEach((el) => _persons.add(Person.fromJSON(el)));
    } catch (e) {
      _error = e.toString();
    }
    notifyListeners();
  }
}
