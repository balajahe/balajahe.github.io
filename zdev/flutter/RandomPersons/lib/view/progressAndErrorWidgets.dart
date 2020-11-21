import 'package:flutter/material.dart';

Widget progerssWidget() => Center(
      child: Container(
          margin: const EdgeInsets.all(10.0),
          child: CircularProgressIndicator()),
    );

Widget errorWidget(String errorMsg, Function() onResume) => Center(
    child: Container(
        margin: const EdgeInsets.all(10.0),
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
