import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong/latlong.dart';

import 'commonWidgets.dart';
import '../model/Place.dart' show PlaceLocation;

class LocationMap extends StatelessWidget {
  final PlaceLocation _location;
  LocationMap(this._location);

  @override
  build(context) => (_location != null)
      ? Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 300,
              padding: EdgeInsets.only(top: 2, left: 3, right: 3),
              child: FlutterMap(
                options: new MapOptions(
                  center: new LatLng(
                    _location.latitude,
                    _location.longitude,
                  ),
                  zoom: 15.0,
                ),
                layers: [
                  new TileLayerOptions(
                      urlTemplate:
                          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                      subdomains: ['a', 'b', 'c']),
                  new MarkerLayerOptions(
                    markers: [
                      new Marker(
                        width: 80.0,
                        height: 80.0,
                        point: new LatLng(
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
              ),
            ),
            PaddingText('${_location.latitude}, ${_location.longitude}',
                style: TextStyle(fontSize: 12), selectable: true, top: 0),
          ],
        )
      : Container();
}
