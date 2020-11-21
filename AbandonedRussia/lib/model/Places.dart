import 'package:flutter/foundation.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../dao/PlacesDao.dart';

class Places with ChangeNotifier {
  bool onlyMine = false;
  bool noMoreData = false;
  bool working = false;
  dynamic error;

  final List<Place> _places = [];

  int get length => _places.length;

  bool testByNum(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _loadNextPart();
      return false;
    }
  }

  Place getByNum(int i) => _places[i];

  Future<void> _loadNextPart() async {
    if (!working && !noMoreData) {
      working = true;
      error = null;
      try {
        var newPlaces = await PlacesDao.instance.getNextPart(
          after: _places.length > 0 ? _places.last.created : null,
          count: LOADING_PART_SIZE,
          onlyMine: onlyMine,
        );
        newPlaces.forEach((v) => _places.add(v));
        if (newPlaces.length < LOADING_PART_SIZE) {
          noMoreData = true;
        }
      } catch (e) {
        print(e);
        error = e;
        noMoreData = true;
      }
      working = false;
      notifyListeners();
    }
  }

  Future<void> add(Place place) async {
    var newPlace = await PlacesDao.instance.add(place);
    _places.insert(0, newPlace);
    notifyListeners();
  }

  Future<void> put(Place place) async {
    await PlacesDao.instance.put(place);
    _places[_places.indexWhere((v) => v.id == place.id)] = place;
    notifyListeners();
  }

  Future<void> del(Place place) async {
    await PlacesDao.instance.del(place);
    _places.removeWhere((v) => v.id == place.id);
    notifyListeners();
  }

  void refresh({bool onlyMine = false}) {
    _places.clear();
    this.onlyMine = onlyMine;
    noMoreData = false;
    error = null;
    working = false;
    notifyListeners();
  }
}
