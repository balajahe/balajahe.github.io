import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/Place.dart';

abstract class PlacesDaoInterface {
  Future<List<Place>> getNextPart({
    DateTime after,
    int count,
    bool onlyMine = false,
  });

  Future<Place> add(Place place);

  Future<void> del(String id);

//  Future<void> put(String id);
}
