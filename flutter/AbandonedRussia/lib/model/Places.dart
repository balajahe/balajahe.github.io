import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../constants.dart';
import '../dao/Dao.dart';
import 'Place.dart';

class Places with ChangeNotifier {
  final List<Place> _places = [];

  Error _error;
  bool _noMoreData = false;

  bool get hasError => _error != null;
  String get error => _error.toString();
  bool get noMoreData => _noMoreData;

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
    if (!_noMoreData) {
      _error = null;
      try {
        var data = await FirebaseFirestore.instance
            .collection('Places')
            //.orderBy('created', descending: false)
            //.startAt(['$i'])
            .get();
        if (data.docs.length > 0) {
          data.docs
              .forEach((doc) => _places.add(Place.fromMap(doc.id, doc.data())));
        } else {
          _noMoreData = true;
        }
      } catch (e) {
        _error = e;
      }
      notifyListeners();
    }
  }

  Future<void> add(Place place) async {
    place.created = DateTime.now();
    place.creator = Dao.currentUser;
    var addedPlace = await FirebaseFirestore.instance
        .collection('Places')
        .add(place.toMap());
    place.id = addedPlace.id;
    print(place.id);
    _places.insert(0, place);
    _noMoreData = false;
    notifyListeners();
  }

  Future<dynamic> connect() async {
    await Dao.connect();
  }
}
