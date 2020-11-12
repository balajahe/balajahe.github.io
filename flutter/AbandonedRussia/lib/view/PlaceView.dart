import 'package:AbandonedRussia/view/commonWidgets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong/latlong.dart';

import '../model/App.dart';
import '../model/Place.dart';
import '../model/Places.dart';
import '../view/PhotoContainer.dart';
import '../view/PlaceEdit.dart';

class PlaceView extends StatelessWidget {
  final Place place;
  PlaceView(this.place);

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(place.title),
        actions: [
          Builder(
              builder: (context) => IconButton(
                  tooltip: 'Удалить',
                  icon: Icon(Icons.delete),
                  onPressed: () => _del(context))),
          Builder(
              builder: (context) => IconButton(
                  tooltip: 'Редактировать',
                  icon: Icon(Icons.edit),
                  onPressed: () => _edit(context))),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.only(top: 5),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SelectableText(
                  place.title,
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SelectableText(
                  place.labelsAsString,
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
          Wrap(
            children: [
              PhotoContainer(place),
              Padding(
                padding: EdgeInsets.all(3),
                child: SelectableText(place.description),
              ),
            ],
          ),
          Container(
            height: 200,
            padding: EdgeInsets.only(left: 3, right: 3),
            child: FlutterMap(
              options: new MapOptions(
                center: new LatLng(
                  place.location.latitude,
                  place.location.longitude,
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
                        place.location.latitude,
                        place.location.longitude,
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
          SelectableText(
            'Координаты: [${place.location.latitude}, ${place.location.longitude}]',
            style: TextStyle(fontSize: 12),
          ),
          Container(height: 5),
          SelectableText(
            'добавлено ' +
                place.created.toString() +
                '\nпользователем ' +
                place.creator.created.toString(),
            style: TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }

  void _del(context) {
    if (place.creator.uid == App.currentUser.uid) {
      showDialog<void>(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Удалить объект?'),
          actions: <Widget>[
            TextButton(
                child: Text('Нет'), onPressed: () => Navigator.pop(context)),
            TextButton(
                child: Text('Да'),
                onPressed: () async {
                  waitStart(context);
                  await context.read<Places>().del(place);
                  waitStop(context);
                  Navigator.pop(context);
                  Navigator.pop(context);
                }),
          ],
        ),
      );
    } else {
      _denied(context);
    }
  }

  void _edit(context) {
    if (place.creator.uid == App.currentUser.uid) {
      Navigator.push(
          context, MaterialPageRoute(builder: (_) => PlaceEdit(place)));
    } else {
      _denied(context);
    }
  }

  void _denied(context) => Scaffold.of(context).showSnackBar(SnackBar(
      content:
          Text('Редактировать и удалять можно объекты, добавленные вами!')));
}
