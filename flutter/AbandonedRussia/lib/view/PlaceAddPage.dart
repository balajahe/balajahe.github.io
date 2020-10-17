import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Place.dart';
import '../model/Places.dart';
import 'commonWidgets.dart';

class PlaceAddPage extends StatefulWidget {
  @override
  createState() => _PlaceAddPageState();
}

class _PlaceAddPageState extends State<PlaceAddPage> {
  final _form = GlobalKey<FormState>();

  @override
  build(context) {
    var places = context.watch<Places>();

    return Scaffold(
      appBar: AppBar(
        title: Text('Новое место'),
      ),
      body: Form(
          key: _form,
          child: Column(children: <Widget>[
            TextFormField(
              decoration: InputDecoration(labelText: 'Краткое название'),
              validator: _emptyValidator,
            ),
            TextFormField(
              decoration: InputDecoration(labelText: 'Описание'),
              minLines: 3,
              maxLines: 10,
              validator: _emptyValidator,
            ),
            FutureBuilder(
                future: places.getLabels(),
                builder: (context, snapshot) {
                  print(snapshot);
                  if (!snapshot.hasError &&
                      snapshot.connectionState == ConnectionState.done) {
                    return Flex(
                        direction: Axis.horizontal,
                        children: snapshot.data
                            .map((v) =>
                                ElevatedButton(child: Text(v), onPressed: null))
                            .toList<Widget>());
                  } else if (snapshot.hasError) {
                    return Error(snapshot.error);
                  } else {
                    return Waiting();
                  }
                }),
          ])),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Сохранить изменения',
        child: Icon(Icons.done),
        onPressed: () {
          if (_form.currentState.validate()) {
            Navigator.pop(context);
          }
        },
      ),
    );
  }

  void _savePlace() {
    Scaffold.of(context)
        .showSnackBar(SnackBar(content: Text('Processing Data')));
  }

  String _emptyValidator(dynamic v) => v.isEmpty ? 'Введите что-нибудь!' : null;
}
