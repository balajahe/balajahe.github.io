import '../model/Place.dart';

abstract class PlacesDaoAbstract {
  Future<List<Place>> getNextPart({
    DateTime after,
    int count,
    bool onlyMine = false,
  });

  Future<Place> add(Place place);

  Future<void> del(String id);

//  Future<void> put(String id);
}
