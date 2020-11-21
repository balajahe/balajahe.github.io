import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../constants.dart';
import './Person.dart';

// Оборачивается в Provider, предоставляет данные всем страницам приложения
class Persons with ChangeNotifier {
  final List<Person> _persons = [];
  bool _isLoading = false;
  String _error;

  Person getByNum(int i) => _persons[i];
  bool testByNum(int i) => i < _persons.length;
  int get length => _persons.length;

  bool get isLoading => _isLoading;
  bool get isError => _error != null;
  String get errorMsg => _error;

  Future<void> loadNextPart() async {
    if (!_isLoading) {
      _isLoading = true;
      _error = null;
      notifyListeners();
      try {
        var response = await http.get(PERSONS_URL, headers: {});
        if (response.statusCode != 200) {
          throw response.body.toString();
        }
        jsonDecode(response.body)['results']
            .forEach((el) => _persons.add(Person.fromJSON(el)));
      } catch (e) {
        _error = e.toString();
      }
      _isLoading = false;
      notifyListeners();
    }
  }
}
