import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/PlaceProvider.dart';
import '../model/LabelProvider.dart';
import '../view/commonWidgets.dart';
import '../view/TakePhoto.dart';

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
            appBar: AppBar(
              title: TITLE,
            ),
            body: snapshot.hasError ? Errors(snapshot.error) : Waiting(),
          );
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
  //final List<Blob> _photos = [];
  bool _isSaving = false;

  @override
  build(context) => Stack(
        children: [
          Scaffold(
            appBar: AppBar(title: TITLE, actions: [
              Builder(
                builder: (context) => IconButton(
                    icon: Icon(Icons.save),
                    tooltip: 'Сохранить',
                    onPressed: () => _save(context)),
              )
            ]),
            body: Form(
              key: _form,
              child: Column(
                children: <Widget>[
                  TextFormField(
                    controller: _title,
                    decoration: InputDecoration(labelText: 'Краткое название'),
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
                          flex: 3,
                          child: Container(
                            color: Colors.grey,
                            child: Wrap(
                              children: widget.allLabels
                                  .map((v) => MaterialButton(
                                        child: Text(v),
                                        onPressed: () => _selectLabel(v),
                                      ))
                                  .toList(),
                            ),
                          )),
                      Expanded(
                        child: Container(
                          color: Colors.grey,
                          child: Wrap(
                            children: _selectedLabels
                                .map((v) => MaterialButton(
                                      child: Text(v),
                                      onPressed: () => _deselectLabel(v),
                                    ))
                                .toList(),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            floatingActionButton: FloatingActionButton(
              tooltip: 'Добавить фото',
              child: Icon(Icons.photo_camera),
              onPressed: () async {
                var blobPhoto = await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => TakePhoto()),
                );
              },
            ),
          ),
          _isSaving
              ? Container(
                  color: Color(0xAAAAAAAA),
                  child: Center(child: CircularProgressIndicator()),
                )
              : Container(),
        ],
      );

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
          images: [],
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
          content: Text(
              'Выберите хотя бы одну метку и заполните все обязательные поля!')));
    }
  }
}
