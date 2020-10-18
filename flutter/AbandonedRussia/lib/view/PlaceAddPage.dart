import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import 'commonWidgets.dart';

class PlaceAddPage extends StatelessWidget {
  @override
  build(context) => FutureBuilder<List<String>>(
      future: context.select((Labels places) => places.getAll)(),
      builder: (context, snapshot) {
        //print(snapshot);
        if (!snapshot.hasError &&
            snapshot.connectionState == ConnectionState.done) {
          return _PlaceAddForm(snapshot.data);
        } else if (snapshot.hasError) {
          return Errors(snapshot.error);
        } else {
          return Waiting();
        }
      });
}

class _PlaceAddForm extends StatefulWidget {
  final List<String> allLabels;
  _PlaceAddForm(this.allLabels);
  @override
  createState() => _PlaceAddFormState();
}

class _PlaceAddFormState extends State<_PlaceAddForm> {
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _desctiption = TextEditingController();
  final List<String> _selectedLabels = [];

  @override
  build(context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Новое место'),
        ),
        body: Form(
            key: _form,
            child: Column(children: <Widget>[
              TextFormField(
                controller: _title,
                decoration: InputDecoration(labelText: 'Краткое название'),
                validator: _emptyValidator,
              ),
              TextFormField(
                controller: _desctiption,
                decoration: InputDecoration(labelText: 'Описание'),
                minLines: 3,
                maxLines: 10,
                validator: _emptyValidator,
              ),
              Row(
                children: [
                  Expanded(
                    child: Column(
                        children: widget.allLabels
                            .map((v) => ElevatedButton(
                                child: Text(v),
                                onPressed: () => _selectLabel(v)))
                            .toList()),
                  ),
                  Expanded(
                      child: Column(
                          children: _selectedLabels
                              .map((v) => ElevatedButton(
                                  child: Text(v),
                                  onPressed: () => _deselectLabel(v)))
                              .toList()))
                ],
              )
            ])),
        floatingActionButton: Builder(
          builder: (context) => FloatingActionButton(
            tooltip: 'Сохранить изменения',
            child: Icon(Icons.done),
            onPressed: () async {
              if (_form.currentState.validate() && _selectedLabels.length > 0) {
                try {
                  await _savePlace(context.read<Places>());
                  Navigator.pop(context);
                } catch (e) {
                  Scaffold.of(context)
                      .showSnackBar(SnackBar(content: Text(e.toString())));
                }
              } else {
                Scaffold.of(context).showSnackBar(SnackBar(
                    content: Text(
                        'Выберите хотя бы одну метку и заполните все обязательные поля!')));
              }
            },
          ),
        ));
  }

  void _selectLabel(String label) {
    setState(() {
      widget.allLabels.remove(label);
      _selectedLabels.add(label);
    });
  }

  void _deselectLabel(String label) {
    setState(() {
      widget.allLabels.add(label);
      _selectedLabels.remove(label);
    });
  }

  Future _savePlace(places) async {
    var place = Place(
      title: _title.text,
      description: _desctiption.text,
      labels: _selectedLabels,
      images: [],
    );
    await places.add(place);
  }

  String _emptyValidator(dynamic v) => v.isEmpty ? 'Введите что-нибудь!' : null;
}
