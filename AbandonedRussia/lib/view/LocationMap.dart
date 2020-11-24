import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong/latlong.dart';

import '../model/Place.dart' show PlaceLocation;
import 'commonWidgets.dart';

const _ZOOM = 15.0;

class LocationMap extends StatefulWidget {
  final PlaceLocation location;
  final Function onTap;
  LocationMap(this.location, {this.onTap});

  @override
  createState() => _LocatonMapState();
}

class _LocatonMapState extends State<LocationMap> {
  PlaceLocation _location;
  MapController _controller;

  @override
  initState() {
    _location = widget.location;
    _controller = MapController();
    super.initState();
  }

  @override
  build(context) {
    if (widget.location != null && _location != widget.location) {
      _location = widget.location;
      try {
        _controller.move(
            LatLng(_location.latitude, _location.longitude), _ZOOM);
      } catch (e) {}
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onDoubleTap: (widget.onTap != null)
              ? widget.onTap
              : () => _showFullscreen(context),
          child: Container(
            height: 250,
            padding: EdgeInsets.only(top: 2, left: 3, right: 3),
            child: _map(),
          ),
        ),
        PaddingText('${_location.latitude}, ${_location.longitude}',
            style: TextStyle(fontSize: 10), selectable: true, top: 0)
      ],
    );
  }

  void _showFullscreen(context) {
    Navigator.push(
        context,
        MaterialPageRoute(
          fullscreenDialog: true,
          builder: (_) => Scaffold(body: _map()),
        ));
  }

  Widget _map() => FlutterMap(
        mapController: _controller,
        options: MapOptions(
          center: LatLng(
            _location.latitude,
            _location.longitude,
          ),
          zoom: _ZOOM,
        ),
        layers: [
          TileLayerOptions(
              urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              subdomains: ['a', 'b', 'c']),
          MarkerLayerOptions(
            markers: [
              new Marker(
                width: 80.0,
                height: 80.0,
                point: LatLng(
                  _location.latitude,
                  _location.longitude,
                ),
                builder: (_) => Icon(
                  Icons.person_pin_circle,
                  color: Colors.red,
                  size: 30,
                ),
              ),
            ],
          ),
        ],
      );
}
