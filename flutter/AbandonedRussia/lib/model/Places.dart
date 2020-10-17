import 'package:flutter/foundation.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'Place.dart';
//import '../dao/PlacesDAO.dart'

class Places with ChangeNotifier {
  final List<Place> _places = [];
  CollectionReference _dbPlaces;
  bool _noMoreData = false;

  Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
    _dbPlaces = FirebaseFirestore.instance.collection('Places');
  }

  int get length => _places.length;

  Place getById(int i) => _places[i];

  bool get noMoreData => _noMoreData;

  bool testById(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _loadNextPart(i);
      return false;
    }
  }

  Future<void> _loadNextPart(int i) async {
    if (!noMoreData) {
      var data = await _dbPlaces
          //.orderBy('created', descending: false)
          //.startAt(['$i'])
          .get();
      if (data.docs.length > 0) {
        data.docs
            .forEach((doc) => _places.add(Place.fromMap(doc.id, doc.data())));
      } else {
        _noMoreData = true;
      }
      notifyListeners();
    }
  }

  Future<void> add(Place place) {
    _places.add(place);
    _noMoreData = false;
    notifyListeners();
  }
}
