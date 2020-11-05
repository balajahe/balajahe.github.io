import 'package:flutter/foundation.dart';

abstract class AbstractModel with ChangeNotifier {
  bool _isWorking = false;
  dynamic errors;

  bool get isWorking => _isWorking;
  bool get isError => errors != null;

  void startWorking() {
    _isWorking = true;
    errors = null;
    notifyListeners();
  }

  void stopWorking() {
    _isWorking = false;
    notifyListeners();
  }
}
