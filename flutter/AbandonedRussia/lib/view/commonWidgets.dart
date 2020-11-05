import 'package:flutter/material.dart';

class Working extends StatelessWidget {
  @override
  build(_) => Container(
      padding: EdgeInsets.only(top: 15),
      child: Center(child: CircularProgressIndicator()));
}

class WorkingTransparent extends StatelessWidget {
  @override
  build(_) => Container(
      padding: EdgeInsets.only(top: 15),
      color: Color(0xAAAAAAAA),
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
    return SingleChildScrollView(
        padding: EdgeInsets.only(top: 15),
        child: Center(
            child: SelectableText('ERROR: ${_error.toString()}\n$stackTrace')));
  }
}
