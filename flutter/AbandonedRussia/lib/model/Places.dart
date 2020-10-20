import 'package:flutter/foundation.dart';

import '../constants.dart';
import '../model/Place.dart';
import '../dao/PlacesDao.dart';

class Places with ChangeNotifier {
  final List<Place> _places = [];

  bool _onlyMy = false;
  bool _isLoading = false;
  bool _noMoreData = false;
  dynamic _error;

  bool get isLoading => _isLoading;
  bool get noMoreData => _noMoreData;
  bool get hasError => _error != null;
  dynamic get error => _error;

  int get length => _places.length;
  Place getByNum(int i) => _places[i];

  bool testByNum(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _loadNextPart(i);
      return false;
    }
  }

  Future<void> _loadNextPart(int from) async {
    if (!_isLoading && !_noMoreData) {
      _isLoading = true;
      _error = null;
      try {
        var newPlaces = await PlacesDao.getNextPart(
          after: _places.length > 0 ? _places.last.created : null,
          count: LOADING_PART_SIZE,
          onlyMy: _onlyMy,
        );
        newPlaces.forEach((v) => _places.add(v));
        if (newPlaces.length < LOADING_PART_SIZE) {
          _noMoreData = true;
        }
      } catch (e) {
        print(e.toString());
        _error = e;
        _noMoreData = true;
      }
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> add(Place place) async {
    try {
      var newPlace = await PlacesDao.add(place);
      _places.insert(0, newPlace);
      _noMoreData = false;
      notifyListeners();
    } catch (e) {
      print(e.toString());
      throw e.toString();
    }
  }

  void refresh({bool onlyMy = false}) {
    _places.clear();
    _onlyMy = onlyMy;
    _noMoreData = false;
    notifyListeners();
  }
}
