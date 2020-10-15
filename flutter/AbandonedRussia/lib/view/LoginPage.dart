import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatelessWidget {
  LoginPage({Key key}) : super(key: key);

  @override
  build(context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Вход и регистрация'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                  'Чтобы добавлять и редактировать места, нужно войти или зарегистрироваться.'),
              RaisedButton(
                child: Text('Войти'),
                onPressed: null,
              ),
              RaisedButton(
                child: Text('Зарегистрироваться'),
                onPressed: null,
              ),
            ],
          ),
        ));
  }
}
