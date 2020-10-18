import 'package:flutter/material.dart';

class Waiting extends StatelessWidget {
  @override
  build(_) => Container(
      margin: EdgeInsets.only(top: 15),
      child: Center(child: CircularProgressIndicator()));
}

class Errors extends StatelessWidget {
  final dynamic _error;
  Errors(this._error);
  @override
  build(_) {
    var stackTrace = '';
    try {
      stackTrace = _error.stackTrace.toString();
    } catch (_) {}
    return Container(
        margin: EdgeInsets.only(top: 15),
        child: Center(
            child: SelectableText('ERROR: ${_error.toString()}\n$stackTrace')));
  }
}
