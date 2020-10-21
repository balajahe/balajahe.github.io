import 'package:flutter/foundation.dart';
import '../dao/LabelsDao.dart';

class LabelProvider with ChangeNotifier {
  List<String> _labels;

  Future<List<String>> getAll() async {
    if (_labels == null) {
      await _loadAll();
    }
    return _labels;
  }

  Future<void> _loadAll() async {
    _labels = await LabelsDao.getAll();
    notifyListeners();
  }
}
