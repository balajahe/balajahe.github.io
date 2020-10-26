import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:typed_data';

import '../model/Place.dart';
import '../model/PlaceProvider.dart';
import '../model/LabelProvider.dart';
import '../view/commonWidgets.dart';
import '../view/PhotoTake.dart';

const TITLE = Text('Новое место');

class PlaceAdd extends StatelessWidget {
  @override
  build(context) => FutureBuilder(
      future: context.watch<LabelProvider>().getAll(),
      builder: (context, snapshot) {
        if (!snapshot.hasError &&
            snapshot.connectionState == ConnectionState.done) {
          return _PlaceAddForm(snapshot.data);
        } else {
          return Scaffold(
            appBar: AppBar(title: TITLE),
            body: snapshot.hasError ? Errors(snapshot.error) : Waiting(),
          );
        }
      });
}

class _PlaceAddForm extends StatefulWidget {
  final List<String> _allLabels;
  _PlaceAddForm(this._allLabels);

  @override
  createState() => _PlaceAddFormState(_allLabels.map((v) => v).toList());
}

class _PlaceAddFormState extends State<_PlaceAddForm> {
  final List<String> _allLabels;
  final _form = GlobalKey<FormState>();
  final _title = TextEditingController();
  final _desctiption = TextEditingController();
  final List<String> _selectedLabels = [];
  final List<Uint8List> _photos = [];
  bool _isSaving = false;

  _PlaceAddFormState(this._allLabels);

  @override
  build(context) => Stack(
        children: [
          Scaffold(
            appBar: AppBar(title: TITLE, actions: [
              Builder(
                builder: (context) => IconButton(
                    icon: Icon(Icons.save),
                    tooltip: 'Сохранить',
                    iconSize: 40,
                    onPressed: () => _save(context)),
              )
            ]),
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
                      minLines: 2,
                      maxLines: 5,
                    ),
                    Container(
                      constraints: BoxConstraints(minHeight: 30),
                      child: Wrap(
                        spacing: 10,
                        children: _selectedLabels
                            .map((v) => TextButton(
                                  style: ButtonStyle(
                                    padding: MaterialStateProperty.all(
                                        EdgeInsets.all(1)),
                                    minimumSize:
                                        MaterialStateProperty.all(Size(1, 1)),
                                  ),
                                  child: Text(v),
                                  onPressed: () => _deselectLabel(v),
                                ))
                            .toList(),
                      ),
                    ),
                    Container(
                      height: 15,
                      margin: EdgeInsets.only(top: 5),
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
                      spacing: 10,
                      children: _allLabels
                          .map((v) => TextButton(
                                style: ButtonStyle(
                                  padding: MaterialStateProperty.all(
                                      EdgeInsets.all(1)),
                                  minimumSize:
                                      MaterialStateProperty.all(Size(1, 1)),
                                ),
                                child: Text(v),
                                onPressed: () => _selectLabel(v),
                              ))
                          .toList(),
                    ),
                    Container(
                      padding: EdgeInsets.only(top: 10),
                      child: Wrap(
                        spacing: 5,
                        runSpacing: 5,
                        children: _photos
                            .map((data) => Image.memory(
                                  data,
                                  width: 100,
                                ))
                            .toList(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            floatingActionButton: FloatingActionButton(
              tooltip: 'Добавить фото',
              child: Icon(Icons.photo_camera),
              onPressed: () async {
                var photoData = await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => PhotoTake()),
                );
                if (photoData != null) {
                  setState(() => _photos.add(photoData));
                }
              },
            ),
          ),
          _isSaving ? WaitingTransparent() : Container(),
        ],
      );

  void _selectLabel(String label) {
    setState(() {
      _allLabels.remove(label);
      _selectedLabels.add(label);
    });
  }

  void _deselectLabel(String label) {
    setState(() {
      _allLabels.add(label);
      _selectedLabels.remove(label);
    });
  }

  Future<void> _save(newContext) async {
    if (_form.currentState.validate() &&
        _title.text.length > 0 &&
        _desctiption.text.length > 0 &&
        _selectedLabels.length > 0) {
      setState(() => _isSaving = true);
      try {
        var place = Place(
          title: _title.text,
          description: _desctiption.text,
          labels: _selectedLabels,
          photos: _photos,
        );
        await context.read<PlaceProvider>().add(place);
        Navigator.pop(context, true);
      } catch (e) {
        print(e);
        Scaffold.of(newContext)
            .showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } else {
      Scaffold.of(newContext).showSnackBar(SnackBar(
          content: Text('Хотя бы одно фото, одна метка, и название!')));
    }
  }
}
