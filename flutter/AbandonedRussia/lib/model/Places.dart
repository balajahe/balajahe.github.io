import '../settings.dart';
import '../model/AbstractModel.dart';
import '../model/Place.dart';

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
      try {
        startWorking();
        var newPlaces = await PlacesDao().getNextPart(
          after: _places.length > 0 ? _places.last.created : null,
          count: LOADING_PART_SIZE,
          onlyMine: onlyMine,
        );
        newPlaces.forEach((v) => _places.add(v));
        if (newPlaces.length < LOADING_PART_SIZE) {
          noMoreData = true;
        }
        stopWorking();
      } catch (e) {
        print(e.toString());
        error = e;
        noMoreData = true;
      }
    }
  }

  Future<void> add(Place place) async {
    try {
      startWorking();
      var newPlace = await PlacesDao().add(place);
      _places.insert(0, newPlace);
      noMoreData = false;
      stopWorking();
    } catch (e) {
      print(e.toString());
      error = e;
    }
  }

  Future<void> del(String id) async {
    try {
      startWorking();
      await PlacesDao().del(id);
      _places.removeWhere((v) => v.id == id);
      stopWorking();
    } catch (e) {
      print(e.toString());
      error = e;
    }
  }

  void refresh({bool onlyMine = false}) {
    _places.clear();
    this.onlyMine = onlyMine;
    noMoreData = false;
    notifyListeners();
  }
}
