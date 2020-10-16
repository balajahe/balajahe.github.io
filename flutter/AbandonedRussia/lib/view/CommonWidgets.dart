import 'package:flutter/material.dart';

class Waiting extends StatelessWidget {
  @override
  build(_) => Container(
      margin: EdgeInsets.only(top: 15),
      child: Center(child: CircularProgressIndicator()));
}
