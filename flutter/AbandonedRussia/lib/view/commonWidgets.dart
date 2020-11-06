import 'package:flutter/material.dart';

class WaitingOrError extends StatelessWidget {
  final dynamic error;
  final bool transparent;

  WaitingOrError({this.error, this.transparent = false});

  @override
  build(context) {
    if (error == null) {
      return transparent ? _WaitingTransparent() : _Waiting();
    } else {
      return Errors(error);
    }
  }
}

class _Waiting extends StatelessWidget {
  @override
  build(_) => Container(
      padding: EdgeInsets.only(top: 15),
      child: Center(child: CircularProgressIndicator()));
}

class _WaitingTransparent extends StatelessWidget {
  @override
  build(_) => Container(
      padding: EdgeInsets.only(top: 15),
      color: Color(0xAAAAAAAA),
      child: Center(child: CircularProgressIndicator()));
}

class Errors extends StatelessWidget {
  final dynamic error;

  Errors(this.error);

  @override
  build(_) {
    var stackTrace = '';
    try {
      stackTrace = error.stackTrace.toString();
    } catch (_) {}
    return SingleChildScrollView(
        padding: EdgeInsets.only(top: 15),
        child: Center(
            child: SelectableText('ERROR: ${error.toString()}\n$stackTrace')));
  }
}
