import 'package:cloud_firestore/cloud_firestore.dart';

class LabelsDao {
  static Future<List<String>> getAll() async =>
      (await FirebaseFirestore.instance
              .collection('Settings')
              .doc('labels')
              .get())
          .data()['labels']
          .map((v) => v)
          .cast<String>()
          .toList();
}
