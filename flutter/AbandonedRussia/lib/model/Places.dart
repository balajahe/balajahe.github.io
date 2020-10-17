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

  bool _hasError = false;
  String _error;
  bool _noMorePlaces = false;

  bool get hasError => _hasError;
  String get error => _error;
  bool get noMorePlaces => _noMorePlaces;

  int get length => _places.length;
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
      _hasError = false;
      try {
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
      } catch (e) {
        _hasError = true;
      }
      notifyListeners();
    }
  }

  Future<List<String>> getLabels() async {
    List<String> res = [];
    (await _dbSettings.doc('labels').get())
        .data()['labels']
        .forEach((v) => res.add(v));
    return res;
  }

  Future<void> addPlace(Place place) async {
    place.created = DateTime.now();
    place.creator = FirebaseAuth.instance.currentUser.uid;
    _places.insert(0, place);
    _noMorePlaces = false;
    notifyListeners();
  }

  Future<dynamic> connect() async {
    await Firebase.initializeApp();
    await FirebaseAuth.instance.signInAnonymously();
    _dbPlaces = FirebaseFirestore.instance.collection('Places');
    _dbSettings = FirebaseFirestore.instance.collection('Settings');
  }
}
