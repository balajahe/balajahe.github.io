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
  var _meta = TextEditingController();

  @override
  initState() {
    _name.text = App.appUser.name;
    _meta.text = App.appUser.meta;
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
                startWaiting(context);
                await App.setUserInfo(name: _name.text, meta: _meta.text);
                stopWaiting(context);
                Navigator.pop(context);
              },
            ),
          ],
        ),
        body: Padding(
          padding: EdgeInsets.only(left: 7),
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
                decoration: InputDecoration(labelText: 'Отображаемое имя'),
                controller: _name,
              ),
              TextField(
                decoration: InputDecoration(labelText: 'Мета'),
                controller: _meta,
                obscureText: true,
              ),
            ],
          ),
        ),
      );
}
