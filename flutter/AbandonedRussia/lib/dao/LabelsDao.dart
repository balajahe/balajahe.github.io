import 'package:cloud_firestore/cloud_firestore.dart';

class LabelsDao {
  Future<List<String>> getAll() async => (await FirebaseFirestore.instance
          .collection('Settings')
          .doc('labels')
          .get())
      .data()['labels']
      .map<String>((v) => v.toString())
      .toList();
}
