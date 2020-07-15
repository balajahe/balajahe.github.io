import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:async';
import 'package:path_provider/path_provider.dart';
import 'package:camera/camera.dart';

const SRV_ADDR = '192.168.43.245:4040';

class VideoClientPage extends StatelessWidget {
  @override build(context) => Scaffold(
    appBar: AppBar(title: Text('Camera')),
    body: VideoClientWidget(),
  );
}

class VideoClientWidget extends StatefulWidget {
  final String srvAddr;
  VideoClientWidget([this.srvAddr = SRV_ADDR]);
  @override createState() => _State();
} 

class _State extends State<VideoClientWidget> {
  TextEditingController _srvAddr;
  CameraController _camera;
  WebSocket _socket;
  String _adir;
  Timer _timer;
  Exception _err;
  bool _recording = false;
  int _recorded = 0;

  @override initState() {
    super.initState();
    () async {
      _adir = (await getApplicationDocumentsDirectory()).path;
      _srvAddr = TextEditingController(text: widget.srvAddr);
      final cams = await availableCameras();
      print('-------\n $cams \n-------\n');
      _camera = CameraController(cams[0], ResolutionPreset.medium);
      await _camera.initialize();
      setState((){});
    }();
  }

  Future<void> _startRec() async {
    try {
      _recorded = _recorded == 1 ? 2 : 1;
      await _camera.startVideoRecording('$_adir/0$_recorded.mp4');
      setState((){});
    } catch(e) { setState(() => _err = e); }
  }

  Future<void> _stopRec(bool again) async {
    try {
      await _camera.stopVideoRecording();
      final prevfile = '$_adir/0$_recorded.mp4';
      if (again) await _startRec();
      _socket.add(await File(prevfile).readAsBytes());
      await File(prevfile).delete();
    } catch(e) { setState(() => _err = e); }
  }

  Future<void> _startStopRec() async {
    _recording = !_recording;
    setState(() =>_err = null);
    if (_recording) {
      try {
        _err = null;
        _socket = await WebSocket.connect('ws://' + _srvAddr.text);
        _fdel('01.mp4'); 
        _fdel('02.mp4');
        await _startRec();
        _timer = Timer.periodic(Duration(seconds: 3), (_) => _stopRec(true));
      } catch(e) { setState(() => _err = e); }
    } else {
      _timer.cancel();
      await _stopRec(false);
      await _socket.close();
    }
  }

  void _fdel(fname) { 
    try { File('$_adir/$fname').deleteSync(); } catch(_) {}
  }

  @override dispose() {
    _timer.cancel();
    _socket.close();
    _camera.dispose();
    super.dispose();
  }

  @override build(context) {
    if (_err != null) return Center(child: Text(_err.toString()));
    if (_camera?.value == null) return Center(child: Text('Activating camera...'));
    return Scaffold(
      body: Column(children: [
        Row(children: [
          Text(' Server: '),
          Expanded(child: TextFormField(
            controller: _srvAddr,
            decoration: InputDecoration(hintText: 'IP:port'),
            //autofocus: true,
          )),
          _recording ? Text('0$_recorded.mp4') : Container(),
        ]),
        Expanded(child: AspectRatio(
          aspectRatio: _camera.value.aspectRatio,
          child: CameraPreview(_camera)
        )),
      ]),
      floatingActionButton: FloatingActionButton.extended(
        label: Text(_recording ? 'STOP' : 'START'),
        backgroundColor: _recording ? Colors.red : null,
        onPressed: _startStopRec,
      ),
    );
  }
}

/*
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: <Widget>[
              TextFormField(
                controller: _taskController,
                key: ArchSampleKeys.taskField,
                style: Theme.of(context).textTheme.headline,
                decoration: InputDecoration(
                  hintText: ArchSampleLocalizations.of(context).newTodoHint,
                ),
                validator: (val) {
                  return val.trim().isEmpty
                      ? ArchSampleLocalizations.of(context).emptyTodoError
                      : null;
                },
              ),
              TextFormField(
                controller: _noteController,
                key: ArchSampleKeys.noteField,
                decoration: InputDecoration(
                  hintText: ArchSampleLocalizations.of(context).notesHint,
                ),
                maxLines: 10,
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        key: ArchSampleKeys.saveTodoFab,
        tooltip: ArchSampleLocalizations.of(context).saveChanges,
        onPressed: () {
          if (_formKey.currentState.validate()) {
            _formKey.currentState.save();
            widget.onEdit(_taskController.text, _noteController.text);
          }
        },
        child: const Icon(Icons.check),
      ),
    );
  }
}
*/
