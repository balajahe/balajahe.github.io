import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../constants.dart';
import '../dao/Dao.dart';
import 'Place.dart';

class Places with ChangeNotifier {
  final List<Place> _places = [];

  bool _isLoading = false;
  bool _noMoreData = false;
  dynamic _error;

  bool get isLoading => _isLoading;
  bool get noMoreData => _noMoreData;
  bool get hasError => _error != null;
  Exception get error => _error;

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

  Future _loadNextPart(int from) async {
    if (!_isLoading && !_noMoreData) {
      _isLoading = true;
      _error = null;
      try {
        var startAt = _places.length > 0
            ? _places.last.created
            : DateTime.fromMillisecondsSinceEpoch(0);
        var data = await FirebaseFirestore.instance
            .collection('Places')
            //.orderBy('created', descending: false)
            //.startAt([startAt])
            //.limit(LOADING_PART_SIZE)
            .get();
        print(data.docs.length);
        if (data.docs.length > 0) {
          data.docs.forEach((doc) {
            print(doc.data());
            _places.add(Place.fromMap(doc.id, doc.data()));
          });
        } else {
          _noMoreData = true;
        }
      } catch (e) {
        _error = e;
      }
      _isLoading = false;
      notifyListeners();
    }
  }

  Future add(Place place) async {
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
}
