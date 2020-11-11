import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import '../model/Location.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PhotoTake.dart';

final _labelButtonStyle = TextButton.styleFrom(minimumSize: Size(25, 25));
final double _labelButtonHeight = 32;
final double _labelButtonSpace = kIsWeb ? 10 : 0;

class PlaceAdd extends StatelessWidget {
  @override
  build(context) => ChangeNotifierProvider<Place>(
        create: (context) => Place(),
        child: FutureBuilder(
          future: context.watch<Labels>().init(),
          builder: (context, snapshot) =>
              snapshot.connectionState != ConnectionState.done
                  ? WaitingOrError(error: snapshot.error)
                  : FutureBuilder(
                      future: context.watch<Location>().init(),
                      builder: (context, snapshot) =>
                          snapshot.connectionState != ConnectionState.done
                              ? WaitingOrError(error: snapshot.error)
                              : _PlaceAddForm(),
                    ),
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
                IconButton(
                    icon: Icon(Icons.save),
                    tooltip: 'Сохранить',
                    onPressed: _save),
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
                      stream: _location.locationChanges(),
                      builder: (context, snapshot) => Text(
                        'Координаты: ${snapshot.data.toString()}',
                      ),
                    )
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
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text('Сохранить изменения?'),
          actions: <Widget>[
            TextButton(
                child: Text('Нет'), onPressed: () => Navigator.pop(context)),
            TextButton(
                child: Text('Да'),
                onPressed: () => Navigator.pop(context, true)),
          ],
        ),
      );
      if (isSave != null) {
        _save();
        return false;
      }
    }
    Navigator.pop(context);
    return false;
  }

  Future<void> _save() async {
    if (_form.currentState.validate() &&
        _title.text.length > 0 &&
        _description.text.length > 0 &&
        _place.labels.length > 0 &&
        _place.photos.length > 0) {
      try {
        setState(() => isWorking = true);
        var place = Place(
          title: _title.text,
          description: _description.text,
          labels: _place.labels,
          photos: _place.photos,
          location: await _location.getLocation(),
        );
        await context.read<Places>().add(place);
        Navigator.pop(context, true);
      } catch (e) {
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
      showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
          title: Text(
              'Заполните все поля,\nминимум одно фото,\nминимум одна метка!'),
          actions: <Widget>[
            TextButton(
                child: Text('OK'), onPressed: () => Navigator.pop(context)),
          ],
        ),
      );
    }
  }
}
