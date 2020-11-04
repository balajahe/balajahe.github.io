import 'package:flutter/foundation.dart';

abstract class AbstractModel with ChangeNotifier {
  bool isWorking = false;
  dynamic errors;

  bool get isError => errors != null;

  void startWorking() {
    isWorking = true;
    errors = null;
    notifyListeners();
  }

  void stopWorking() {
    isWorking = false;
    notifyListeners();
  }
}
