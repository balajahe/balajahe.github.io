import '../statics.dart';
import 'AbstractModel.dart';
import 'Place.dart';
import '../dao/PlacesDao.dart';

class Places extends AbstractModel {
  bool onlyMine = false;
  bool noMoreData = false;

  final List<Place> _places = [];

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
    if (!isWorking && !noMoreData) {
      startWorking();
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
      } catch (e) {
        print(e.toString());
        errors = e;
        noMoreData = true;
      }
      stopWorking();
    }
  }

  Future<void> add(Place place) async {
    startWorking();
    try {
      var newPlace = await PlacesDao().add(place);
      _places.insert(0, newPlace);
      noMoreData = false;
    } catch (e) {
      print(e.toString());
      errors = e;
    }
    stopWorking();
  }

  Future<void> del(String id) async {
    startWorking();
    try {
      await PlacesDao().del(id);
      _places.removeWhere((v) => v.id == id);
    } catch (e) {
      print(e.toString());
      errors = e;
    }
    stopWorking();
  }

  void refresh({bool onlyMine = false}) {
    _places.clear();
    onlyMine = onlyMine;
    noMoreData = false;
    notifyListeners();
  }
}
