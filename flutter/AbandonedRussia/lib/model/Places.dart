import 'package:flutter/foundation.dart';

import '../settings.dart';
import '../model/Place.dart';
import '../dao/PlacesDao.dart';

class Places with ChangeNotifier {
  bool onlyMine = false;
  bool noMoreData = false;

  final List<Place> _places = [];

  int get length => _places.length;

  Future<Place> getByNum(int i) async {
    if (i >= _places.length && !noMoreData) {
      await _loadNextPart(i);
    }
    return (i < _places.length) ? _places[i] : null;
  }

  Future<void> _loadNextPart(int from) async {
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
      notifyListeners();
    } catch (e) {
      noMoreData = true;
      print(e);
      throw e;
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
    notifyListeners();
  }
}
