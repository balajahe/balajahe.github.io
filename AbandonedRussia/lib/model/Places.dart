import 'dart:async';

import '../settings.dart';
import '../model/Place.dart';
import '../dao/PlacesDao.dart';

enum PlacesEvent { load, clear, render }

class Places {
  final List<Place> _places = [];
  bool onlyMine = false;
  String searchString;
  bool noMoreData = false;
  var _in = StreamController<PlacesEvent>();
  var _out = StreamController<PlacesEvent>();

  Places() {
    var inIter = StreamIterator<PlacesEvent>(_in.stream);
    (() async {
      while (await inIter.moveNext()) {
        if (inIter.current == PlacesEvent.clear) {
          noMoreData = false;
          _places.clear();
          _out.add(PlacesEvent.render);
        } else {
          await _loadNextPart();
        }
      }
    })();
  }

  Stream get stream => _out.stream;

  int get length => _places.length;

  Place getByNum(int i) => _places[i];

  bool testByNum(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _in.add(PlacesEvent.load);
      return false;
    }
  }

  Future<void> _loadNextPart() async {
    if (!noMoreData) {
      try {
        var newPlaces = await PlacesDao.instance.getNextPart(
          after: _places.length > 0 ? _places.last.created : null,
          count: LOAD_PART_SIZE,
          onlyMine: onlyMine,
          searchString: searchString,
        );
        newPlaces.forEach((v) => _places.add(v));
        if (newPlaces.length < LOAD_PART_SIZE) {
          noMoreData = true;
        }
        _out.add(PlacesEvent.render);
      } catch (e) {
        _out.addError(e);
        noMoreData = true;
      }
    }
  }

  Future<void> add(Place place) async {
    var newPlace = await PlacesDao.instance.add(place);
    _places.insert(0, newPlace);
    _out.add(PlacesEvent.render);
  }

  Future<void> put(Place place) async {
    await PlacesDao.instance.put(place);
    _places[_places.indexWhere((v) => v.id == place.id)] = place;
    _out.add(PlacesEvent.render);
  }

  Future<void> del(Place place) async {
    await PlacesDao.instance.del(place);
    _places.removeWhere((v) => v.id == place.id);
    _out.add(PlacesEvent.render);
  }

  void refresh({bool onlyMine = false, String searchString}) {
    this.onlyMine = onlyMine;
    this.searchString = searchString;
    _in.add(PlacesEvent.clear);
  }
}
