import 'package:flutter/foundation.dart';

import '../settings.dart';
import '../model/Place.dart';

class Places with ChangeNotifier {
  bool onlyMine = false;
  bool noMoreData = false;

  final List<Place> _places = [];

  int get length => _places.length;

  Future<Place> getByNum(int i) async {
    if (i >= _places.length && !noMoreData) {
      await _loadNextPart(i);
    }
    if (i < _places.length) {
      return _places[i];
    } else {
      return null;
    }
  }

  Future<void> _loadNextPart(int from) async {
    try {
      var newPlaces = await PlacesDao().getNextPart(
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
      throw e;
    }
  }

  Future<void> add(Place place) async {
    var newPlace = await PlacesDao().add(place);
    _places.insert(0, newPlace);
    notifyListeners();
  }

  Future<void> del(String id) async {
    await PlacesDao().del(id);
    _places.removeWhere((v) => v.id == id);
    notifyListeners();
  }

  void refresh({bool onlyMine = false}) {
    _places.clear();
    this.onlyMine = onlyMine;
    noMoreData = false;
    notifyListeners();
  }
}
