import 'dart:async';

import 'package:flutter/foundation.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'Place.dart';
//import '../dao/PlacesDAO.dart'

class Places with ChangeNotifier {
  final List<Place> _places = [];
  CollectionReference _dbPlaces;
  CollectionReference _dbSettings;
  bool _noMorePlaces = false;

  Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
    _dbPlaces = FirebaseFirestore.instance.collection('Places');
    _dbSettings = FirebaseFirestore.instance.collection('Settings');
  }

  int get length => _places.length;
  bool get noMorePlaces => _noMorePlaces;
  Place getPlaceByNum(int i) => _places[i];

  bool testPlaceByNum(int i) {
    if (i < _places.length) {
      return true;
    } else {
      _loadNextPlaces(i);
      return false;
    }
  }

  Future<void> _loadNextPlaces(int i) async {
    if (!noMorePlaces) {
      var data = await _dbPlaces
          //.orderBy('created', descending: false)
          //.startAt(['$i'])
          .get();
      if (data.docs.length > 0) {
        data.docs
            .forEach((doc) => _places.add(Place.fromMap(doc.id, doc.data())));
      } else {
        _noMorePlaces = true;
      }
      notifyListeners();
    }
  }

  Future<List<String>> getLabels() async {
    var data = await _dbSettings.doc('labels').get();
    List<String> res = [];
    data.data()['labels'].forEach((v) => res.add(v));
    return res;
  }

  Future<void> addPlace(Place place) {
    _places.add(place);
    _noMorePlaces = false;
    notifyListeners();
  }
}
