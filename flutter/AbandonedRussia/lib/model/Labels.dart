import 'package:flutter/foundation.dart';
import '../dao/LabelsDao.dart';

class Labels with ChangeNotifier {
  Future<List<String>> getAll() async => await LabelsDao.getAll();
}
