import 'package:flutter/foundation.dart';

import '../dao/LabelsDao.dart';

class Labels with ChangeNotifier {
  List<String> _labels;

  Future<List<String>> getAll() async {
    if (_labels == null) {
      _labels = await LabelsDao().getAll();
    }
    return _labels;
  }
}
