import 'package:location/location.dart' as sys;

class Location {
  final sys.Location _location = new sys.Location();
  bool enabled = false;

  Future<void> init() async {
    enabled =
        (await _location.serviceEnabled() || await _location.requestService());
    if (enabled) {
      enabled = (await _location.hasPermission() ==
              sys.PermissionStatus.granted ||
          await _location.requestPermission() == sys.PermissionStatus.granted);
    }
  }

  Future<List<double>> getLocation() async {
    var loc = await _location.getLocation();
    return [loc.latitude, loc.longitude, loc.accuracy];
  }

  Stream<List<double>> locationChanges() => _location.onLocationChanged
      .map((v) => [v.latitude, v.longitude, v.accuracy]);
}
