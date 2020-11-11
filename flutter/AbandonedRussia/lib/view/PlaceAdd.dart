import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoContainer.dart';
import '../view/PhotoTake.dart';

final _labelButtonStyle = TextButton.styleFrom(minimumSize: Size(20, 20));
final double _labelButtonHeight = kIsWeb ? 25 : 32;
final double _labelButtonSpace = kIsWeb ? 10 : 0;

class PlaceAdd extends StatelessWidget {
  @override
  build(context) => ChangeNotifierProvider<Place>(
      create: (context) => Place(),
      child: FutureBuilder(
          future: context.watch<Labels>().getAll(),
          builder: (context, snapshot) => snapshot.hasData
              ? _PlaceAddForm(snapshot.data)
              : WaitingOrError(error: snapshot.error)));
}

class _PlaceAddForm extends StatefulWidget {
  final List<String> _allLabels;
  _PlaceAddForm(this._allLabels);

  @override
  createState() => _PlaceAddFormState(_allLabels.map((v) => v).toList());
}

class _PlaceAddFormState extends State<_PlaceAddForm> {
  Place _place;
  final List<String> _allLabels;
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _desctiption = TextEditingController();
  bool isWorking = false;

  _PlaceAddFormState(this._allLabels);

  @override
  build(context) {
    _place = context.watch<Place>();
    return Stack(
      children: [
        WillPopScope(
          onWillPop: () => _onExit(context),
          child: Scaffold(
            appBar: AppBar(
              title: Text('Новый объект'),
              leading: Builder(
                builder: (context) => IconButton(
                    icon: Icon(Icons.arrow_back),
                    onPressed: () => _onExit(context)),
              ),
              actions: [
                Builder(
                  builder: (context) => IconButton(
                      icon: Icon(Icons.save),
                      tooltip: 'Сохранить',
                      onPressed: () => _save(context)),
                )
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
                      controller: _desctiption,
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
        _desctiption.text.length > 0 ||
        _place.labels.length > 0 ||
        _place.photos.length > 0) {
      var res = await showDialog(
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
      if (res != null) {
        _save(newContext);
        return false;
      }
    }
    Navigator.pop(context);
    return false;
  }

  Future<void> _save(newContext) async {
    if (_form.currentState.validate() &&
        _title.text.length > 0 &&
        _desctiption.text.length > 0 &&
        _place.labels.length > 0 &&
        _place.photos.length > 0) {
      try {
        var place = Place(
          title: _title.text,
          description: _desctiption.text,
          labels: _place.labels,
          photos: _place.photos,
        );
        setState(() => isWorking = true);
        await context.read<Places>().add(place);
        Navigator.pop(context, true);
      } catch (e) {
        Scaffold.of(newContext)
            .showSnackBar(SnackBar(content: SelectableText(e.toString())));
      }
    } else {
      Scaffold.of(newContext).showSnackBar(SnackBar(
          content: Text(
              'Заполните все поля, минимум одно фото, минимум одна метка!')));
    }
  }
}
