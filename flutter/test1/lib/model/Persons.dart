import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../constants.dart';
import './Person.dart';

// Оборачивается в Provider, предоставляет данные всем страницам приложения
class Persons with ChangeNotifier {
  final List<Person> _persons = [];
  // не очень хорошо использовать пустоту, нужно использовать enum
  String _error = '';

  get length => _persons.length;
  get error => _error;

  Person getByNum(int i) => _persons[i];

  // нарушение SOLID
  // не очень хорошо зашивать логику сториджа в доменную модель, нужно вынести в отдельный класс
  Future<void> loadNextPart() async {
    try {
      var response = await http.get(PERSONS_URL);
      jsonDecode(response.body)['results']
          .forEach((el) => _persons.add(Person.fromJSON(el)));
      _error = '';
    } catch (e) {
      _error = e.toString();
    }
    notifyListeners();
  }
}
