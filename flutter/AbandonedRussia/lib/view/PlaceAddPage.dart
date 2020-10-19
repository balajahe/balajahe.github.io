import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import '../model/Labels.dart';
import 'commonWidgets.dart';

const TITLE = Text('Новое место');

class PlaceAddPage extends StatelessWidget {
  @override
  build(context) => FutureBuilder<List<String>>(
      future: context.select((Labels labels) => labels.getAll)(),
      builder: (context, snapshot) {
        if (!snapshot.hasError &&
            snapshot.connectionState == ConnectionState.done) {
          return _PlaceAddForm(snapshot.data);
        } else {
          return Scaffold(
              appBar: AppBar(
                title: TITLE,
              ),
              body: snapshot.hasError ? Errors(snapshot.error) : Waiting());
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
  bool _isSaving = false;

  @override
  build(context) {
    return Stack(children: [
      Scaffold(
          appBar: AppBar(
            title: TITLE,
          ),
          body: Form(
              key: _form,
              child: Column(children: <Widget>[
                TextFormField(
                  controller: _title,
                  decoration: InputDecoration(labelText: 'Краткое название'),
                  autofocus: true,
                ),
                TextFormField(
                  controller: _desctiption,
                  decoration: InputDecoration(labelText: 'Описание'),
                  minLines: 2,
                  maxLines: 5,
                ),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: Wrap(
                          spacing: 5,
                          runSpacing: 5,
                          children: widget.allLabels
                              .map((v) => ElevatedButton(
                                  child: Text(v),
                                  onPressed: () => _selectLabel(v)))
                              .toList()),
                    ),
                    Expanded(
                        child: Wrap(
                            spacing: 5,
                            runSpacing: 5,
                            children: _selectedLabels
                                .map((v) => ElevatedButton(
                                    child: Text(v),
                                    onPressed: () => _deselectLabel(v)))
                                .toList()))
                  ],
                ),
              ])),
          floatingActionButton: Builder(
              builder: (context) => FloatingActionButton(
                    tooltip: 'Сохранить',
                    child: Icon(Icons.done),
                    onPressed: () async {
                      if (_form.currentState.validate() &&
                              _title.text.length > 0
                          //_desctiption.text.length > 0 &&
                          //_selectedLabels.length > 0
                          ) {
                        setState(() => _isSaving = true);
                        try {
                          await _savePlace(context.read<Places>());
                          Navigator.pop(context, true);
                        } catch (e) {
                          Scaffold.of(context).showSnackBar(
                              SnackBar(content: Text(e.toString())));
                        }
                      } else {
                        Scaffold.of(context).showSnackBar(SnackBar(
                            content: Text(
                                'Выберите хотя бы одну метку и заполните все обязательные поля!')));
                      }
                    },
                  ))),
      _isSaving
          ? Container(
              color: Color(0xAAAAAAAA),
              child: Center(child: CircularProgressIndicator()),
            )
          : Container(),
    ]);
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

  //String _emptyValidator(dynamic v) => v.isEmpty ? 'Введите что-нибудь!' : null;
}
