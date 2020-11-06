import 'package:flutter/foundation.dart';

abstract class AbstractModel with ChangeNotifier {
  bool _isWorking = false;
  dynamic error;

  bool get isWorking => _isWorking;
  bool get isError => error != null;

  void startWorking() {
    _isWorking = true;
    error = null;
    notifyListeners();
  }

  void stopWorking() {
    _isWorking = false;
    notifyListeners();
  }
}
