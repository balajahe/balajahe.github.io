import '../dao/LabelsDao.dart';

class Labels {
  List<String> _labels;

  Future<List<String>> getAll() async {
    if (_labels == null) {
      _labels = await LabelsDao().getAll();
    }
    return _labels;
  }
}
