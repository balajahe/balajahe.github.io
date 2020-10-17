import 'package:flutter/material.dart';

class Waiting extends StatelessWidget {
  @override
  build(_) => Container(
      margin: EdgeInsets.only(top: 15),
      child: Center(child: CircularProgressIndicator()));
}

class Error extends StatelessWidget {
  final dynamic error;
  Error(this.error);
  @override
  build(_) => Container(
      margin: EdgeInsets.only(top: 15),
      child: Center(child: SelectableText('ERROR: ' + error.toString())));
}
