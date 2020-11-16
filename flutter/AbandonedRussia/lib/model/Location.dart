import 'package:location/location.dart' as sys;

import '../model/Place.dart' show PlaceLocation;

class Location {
  final sys.Location _location = sys.Location();
  bool _enabled = false;

  Future<void> init() async {
    _enabled = (await _location.serviceEnabled() ||
            await _location.requestService()) &&
        (await _location.hasPermission() == sys.PermissionStatus.granted ||
            await _location.requestPermission() ==
                sys.PermissionStatus.granted);
  }

  bool get enabled => _enabled;

  Stream<PlaceLocation> get locationChanges => (_enabled)
      ? _location.onLocationChanged
          .map((v) => PlaceLocation(v.latitude, v.longitude, v.accuracy))
      : Stream<PlaceLocation>.empty();
}
