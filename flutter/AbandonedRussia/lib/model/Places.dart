import 'package:flutter/foundation.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'Place.dart';
//import '../dao/PlacesDAO.dart'

class Places with ChangeNotifier {
  final List<Place> _places = [];
  CollectionReference _dbCollection;
  bool _noMoreData = false;

  Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
    _dbCollection = FirebaseFirestore.instance.collection('Places');
  }

  int get length => _places.length;

  Place getById(int i) => _places[i];

  bool get noMoreData => _noMoreData;

  bool testById(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _loadNext(i);
      return false;
    }
  }

  void _loadNext(int i) {
    if (!noMoreData) {
      _dbCollection.doc('$i').get().then((v) {
        if (v.exists) {
          _places.add(Place.fromMap(int.parse(v.id), v.data()));
        } else {
          _noMoreData = true;
        }
        notifyListeners();
      });
    }
  }

  void add(Place place) {
    _places.add(place);
    _noMoreData = false;
    notifyListeners();
  }
}
