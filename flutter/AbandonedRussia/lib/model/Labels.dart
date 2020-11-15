import '../dao/LabelsDao.dart';

class Labels {
  List<String> _all;

  Future<void> init() async {
    if (_all == null) _all = await LabelsDao().getAll();
  }

  List<String> getAll() => _all.map<String>((v) => v).toList();

  void setAll(List<String> all) => _all = all;
}
