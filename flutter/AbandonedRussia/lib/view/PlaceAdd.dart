import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong/latlong.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import '../model/Location.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PhotoTake.dart';

final double _labelButtonHeight = 32;
final double _labelButtonSpace = kIsWeb ? 10 : 0;
final _labelButtonStyle = TextButton.styleFrom(minimumSize: Size(25, 25));

class PlaceAdd extends StatelessWidget {
  @override
  build(context) => ChangeNotifierProvider<Place>(
        create: (context) => Place(),
        child: FutureBuilder(
          future: Future.wait([
            context.watch<Labels>().init(),
            context.watch<Location>().init(),
          ]),
          builder: (context, snapshot) =>
              snapshot.connectionState != ConnectionState.done
                  ? WaitingOrError(error: snapshot.error)
                  : _PlaceAddForm(),
        ),
      );
}

class _PlaceAddForm extends StatefulWidget {
  @override
  createState() => _PlaceAddFormState();
}

class _PlaceAddFormState extends State<_PlaceAddForm> {
  Place _place;
  List<String> _allLabels;
  Location _location;
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _description = TextEditingController();
  BuildContext _scaffoldContext;
  bool isWorking = false;

  @override
  build(context) {
    _place = context.watch<Place>();
    _allLabels = context.watch<Labels>().getAll();
    _location = context.watch<Location>();
    return Stack(
      children: [
        WillPopScope(
          onWillPop: () => _onExit(context),
          child: Scaffold(
            appBar: AppBar(
              title: Text('Новый объект'),
              actions: [
                Builder(builder: (context) {
                  _scaffoldContext = context;
                  return IconButton(
                    icon: Icon(Icons.save),
                    tooltip: 'Сохранить',
                    onPressed: _save,
                  );
                }),
              ],
            ),
            floatingActionButton: FloatingActionButton(
                tooltip: 'Добавить фото',
                child: Icon(Icons.photo_camera),
                onPressed: _addPhoto),
            body: SingleChildScrollView(
              child: Form(
                key: _form,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    TextFormField(
                      controller: _title,
                      decoration:
                          InputDecoration(labelText: 'Краткое название'),
                    ),
                    TextFormField(
                      controller: _description,
                      decoration: InputDecoration(labelText: 'Описание'),
                      minLines: 3,
                      maxLines: 7,
                    ),
                    Container(
                      constraints:
                          BoxConstraints(minHeight: _labelButtonHeight),
                      child: Wrap(
                        spacing: _labelButtonSpace,
                        children: _place.labels
                            .map((v) => Container(
                                height: _labelButtonHeight,
                                child: TextButton(
                                  style: _labelButtonStyle,
                                  child: Text(v),
                                  onPressed: () => _deselectLabel(v),
                                )))
                            .toList(),
                      ),
                    ),
                    Container(
                      child: Row(children: [
                        Text('Добавить метку: ',
                            style: TextStyle(fontStyle: FontStyle.italic)),
                        Expanded(
                          child: Container(
                              height: 1,
                              margin: EdgeInsets.only(top: 10),
                              color: Colors.grey[400]),
                        ),
                      ]),
                    ),
                    Wrap(
                      spacing: _labelButtonSpace,
                      children: _allLabels
                          .map((v) => Container(
                              height: _labelButtonHeight,
                              child: TextButton(
                                style: _labelButtonStyle,
                                child: Text(v),
                                onPressed: () => _selectLabel(v),
                              )))
                          .toList(),
                    ),
                    PhotoContainer(_place),
                    StreamBuilder(
                      stream: _location.locationChanges,
                      builder: (context, snapshot) {
                        _place.location = PlaceLocation(
                          snapshot.data.latitude,
                          snapshot.data.longitude,
                          snapshot.data.accuracy,
                        );
                        return Container(
                          height: 200,
                          padding: EdgeInsets.only(left: 3, right: 3),
                          child: FlutterMap(
                            options: new MapOptions(
                              center: new LatLng(
                                snapshot.data.latitude,
                                snapshot.data.longitude,
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
                                      snapshot.data.latitude,
                                      snapshot.data.longitude,
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
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        isWorking ? WaitingOrError(transparent: true) : Container(),
      ],
    );
  }

  Future<void> _addPhoto() async {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ChangeNotifierProvider.value(
          value: _place,
          child: PhotoTake(),
        ),
      ),
    );
  }

  void _selectLabel(String label) {
    setState(() {
      _allLabels.remove(label);
      _place.labels.add(label);
    });
  }

  void _deselectLabel(String label) {
    setState(() {
      _allLabels.add(label);
      _place.labels.remove(label);
    });
  }

  Future<bool> _onExit(newContext) async {
    if (_title.text.length > 0 ||
        _description.text.length > 0 ||
        _place.labels.length > 0 ||
        _place.photos.length > 0) {
      var isSave = await showDialog(
        barrierDismissible: false,
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Сохранить изменения?'),
          actions: <Widget>[
            TextButton(
                child: Text('Нет'),
                onPressed: () => Navigator.pop(context, false)),
            TextButton(
                child: Text('Да'),
                onPressed: () => Navigator.pop(context, true)),
          ],
        ),
      );
      if (isSave is bool && isSave) {
        _save();
        return false;
      } else if (isSave is bool) {
        Navigator.pop(context);
      }
    }
    return true;
  }

  Future<void> _save() async {
    if (_form.currentState.validate() &&
        _title.text.length > 0 &&
        _description.text.length > 0 &&
        _place.labels.length > 0 &&
        _place.photos.length > 0) {
      try {
        setState(() => isWorking = true);
        _place
          ..title = _title.text
          ..description = _description.text;

        await context.read<Places>().add(_place);
        Navigator.pop(context, true);
      } catch (e) {
        print(e);
        showDialog(
          context: context,
          builder: (BuildContext context) => AlertDialog(
            title: Text(e.toString()),
            actions: <Widget>[
              TextButton(
                  child: Text('OK'), onPressed: () => Navigator.pop(context)),
            ],
          ),
        );
      }
    } else {
      Scaffold.of(_scaffoldContext).showSnackBar(SnackBar(
          content: Text(
              'Заполните все поля, минимум одно фото, минимум одна метка!')));
    }
  }
}
