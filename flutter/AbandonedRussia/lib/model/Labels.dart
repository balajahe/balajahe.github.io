import '../dao/LabelsDao.dart';

class Labels {
  List<String> _labels;

  Future<void> init() async {
    _labels = await LabelsDao().getAll();
  }

  List<String> getAll() => _labels.map<String>((v) => v).toList();
}
