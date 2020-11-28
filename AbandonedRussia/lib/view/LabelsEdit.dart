import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/Labels.dart';
import 'commonWidgets.dart';

class LabelsEdit extends StatefulWidget {
  @override
  createState() => _LabelsEditState();
}

class _LabelsEditState extends State<LabelsEdit> {
  var _labels = TextEditingController();
  bool _done = false;
  dynamic _error;

  @override
  initState() {
    var labelsModel = context.read<Labels>();
    labelsModel
        .init()
        .then((_) => setState(() {
              _labels.text = labelsModel.getAll().join(', ') + ',\n';
              _done = true;
            }))
        .catchError((e) => setState(() => _error = e));
    super.initState();
  }

  @override
  build(context) => (_done)
      ? Scaffold(
          appBar: AppBar(
            title: Text("Редактировать метки"),
            actions: [
              IconButton(
                tooltip: 'Сохранить',
                icon: Icon(Icons.save),
                onPressed: () async {
                  startWaiting(context);
                  await context.read<Labels>().setAll(_labels.text
                      .split(',')
                      .map((v) => v.trim())
                      .where((v) => v.length > 0)
                      .toList());
                  stopWaiting(context);
                  Navigator.pop(context);
                },
              ),
            ],
          ),
          body: Padding(
            padding: EdgeInsets.only(left: 7),
            child: TextField(
              controller: _labels,
              minLines: 7,
              maxLines: 20,
            ),
          ),
        )
      : WaitingOrError(error: _error);
}
