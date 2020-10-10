import 'package:flutter/material.dart';

Widget progerssWidget() => Container(
      margin: const EdgeInsets.all(10.0),
      child: Center(child: CircularProgressIndicator()),
    );

Widget errorWidget(String errorMsg, Function onResume) => Container(
    margin: const EdgeInsets.all(10.0),
    child: Center(
        child: Column(children: [
      RaisedButton(
        child: Text('Error, try again!'),
        onPressed: onResume,
      ),
      Text(
        errorMsg,
        style: TextStyle(color: Colors.red),
      ),
    ])));
