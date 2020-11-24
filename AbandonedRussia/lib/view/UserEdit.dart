import 'package:flutter/material.dart';

import '../model/App.dart';
import 'commonWidgets.dart';

final _LABEL_STYLE = TextStyle(fontSize: 12, color: Colors.grey[600]);

class UserEdit extends StatefulWidget {
  @override
  createState() => _UserEditState();
}

class _UserEditState extends State<UserEdit> {
  var _name = TextEditingController();

  @override
  initState() {
    _name.text = App.appUser.name;
    super.initState();
  }

  @override
  build(context) => Scaffold(
        appBar: AppBar(
          title: Text("Мой профиль"),
          actions: [
            IconButton(
              tooltip: 'Сохранить',
              icon: Icon(Icons.save),
              onPressed: () async {
                var name = _name.text;
                startWaiting(context);
                await App.setUserInfo(name: name);
                stopWaiting(context);
                Navigator.pop(context);
              },
            ),
          ],
        ),
        body: Padding(
          padding: EdgeInsets.only(left: 5),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(height: 12),
              Text('ID', style: _LABEL_STYLE),
              SelectableText(App.appUser.uid),
              Container(height: 12),
              Text('Зарегистрирован', style: _LABEL_STYLE),
              SelectableText(App.appUser.registered.toString()),
              TextField(
                controller: _name,
                decoration: InputDecoration(labelText: 'Отображаемое имя'),
              ),
            ],
          ),
        ),
      );
}
