import 'dart:async';

import 'package:flutter/foundation.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class Labels with ChangeNotifier {
  String _error;

  bool get hasError => _error != null;
  String get error => _error;

  Future<List<String>> getAll() async {
    List<String> res = [];
    (await FirebaseFirestore.instance
            .collection('Settings')
            .doc('labels')
            .get())
        .data()['labels']
        .forEach((v) => res.add(v));
    return res;
  }
}
