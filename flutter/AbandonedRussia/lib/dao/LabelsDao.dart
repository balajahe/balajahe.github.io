import 'package:cloud_firestore/cloud_firestore.dart';

class LabelsDao {
  Future<List<String>> getAll() async {
    var doc = await FirebaseFirestore.instance
        .collection('Settings')
        .doc('labels')
        .get();
    return doc.data()['labels'].map<String>((v) => v.toString()).toList();
  }

  Future<void> setAll(List<String> _all) async {
    await FirebaseFirestore.instance
        .collection('Settings')
        .doc('labels')
        .set({'labels': _all});
  }
}
