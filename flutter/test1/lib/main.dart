import 'package:flutter/material.dart';

const TITLE = 'Untitle';
const IMAGE_PATH = 'assets/BPM.png';
const INITIAL_SCALE = 10.0;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: TITLE,
      theme: ThemeData(primarySwatch: Colors.blue),
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  double _scale = INITIAL_SCALE;
  double _dx = 0;
  double _dy = 0;

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: null,
        ),
        title: Text(TITLE),
      ),
      body: GestureDetector(
        onDoubleTap: () => setState(() {
          _scale = _scale == 1 ? INITIAL_SCALE : 1;
        }),
        onHorizontalDragUpdate: (details) => _onDragUpdate(details.delta),
        onVerticalDragUpdate: (details) => _onDragUpdate(details.delta),
        child: Center(
          child: OverflowBox(
            child: Image.asset(
              IMAGE_PATH,
              width: 2000,
              height: 2000,
              scale: _scale,
            ),
          ),
        ),
      ),
    );
  }

  _onDragUpdate(delta) {
    print('${delta.dx} - ${delta.dy}');
    // setState(() {
    //   _dx = details.delta.dx;
    //   _dy = details.delta.dy;
  }
}
