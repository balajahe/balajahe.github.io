import '../dao/LabelsDao.dart';

class Labels {
  List<String> _all;

  Future<void> init() async {
    if (_all == null) {
      _all = await LabelsDao().getAll();
      //notifyListeners();
    }
  }

  List<String> getAll() => _all.map<String>((v) => v).toList();

  Future<void> setAll(List<String> all) async {
    _all = all;
    await LabelsDao().setAll(_all);
    //notifyListeners();
  }
}
