import 'package:location/location.dart' as loc;

import '../model/Place.dart' show PlaceLocation;

class Location {
  final loc.Location _location = loc.Location();
  bool enabled = false;

  Future<void> init() async {
    enabled =
        (await _location.serviceEnabled() || await _location.requestService());
    if (enabled) {
      enabled = (await _location.hasPermission() ==
              loc.PermissionStatus.granted ||
          await _location.requestPermission() == loc.PermissionStatus.granted);
    }
  }

  Future<PlaceLocation> getLocation() async {
    var loc = await _location.getLocation();
    return PlaceLocation(loc.latitude, loc.longitude, loc.accuracy);
  }

  Stream<PlaceLocation> get locationChanges => _location.onLocationChanged
      .map((v) => PlaceLocation(v.latitude, v.longitude, v.accuracy));
}
