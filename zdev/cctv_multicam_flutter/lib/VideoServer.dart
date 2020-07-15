import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:async';
import 'package:path_provider/path_provider.dart';
import 'package:video_player/video_player.dart';

const SRV_PORT = 4040;

class VideoServerPage extends StatelessWidget {
  @override build(context) => Scaffold(
    appBar: AppBar(title: Text('Recorder')),
    body: VideoServerWidget(),
  );
}

class VideoServerWidget extends StatefulWidget {
  final int srvPort;
  VideoServerWidget([this.srvPort = SRV_PORT]);
  @override createState() => _State();
}

class _State extends State<VideoServerWidget> {
  HttpServer _server;
  WebSocket _socket;
  VideoPlayerController _player;
  String _adir;
  Exception _err;
  bool _playing = false;
  int _received = 0;
  int _played = 0;

  @override initState() {
    super.initState();
    () async {
      try {
        _adir = (await getApplicationDocumentsDirectory()).path;
        _server = await HttpServer.bind('127.0.0.1', SRV_PORT);
        _server.listen((req) async {
          try {
            _socket = await WebSocketTransformer.upgrade(req);
            _socket.listen((msg) async {
              try {
                await File('$_adir/${_received+1}.mp4').writeAsBytes(msg);
                _received++;
                if (!_playing) {
                  if (_played == 0) {
                    Timer(Duration(seconds: 3), _play);
                  } else if (_received > _played) {
                    _play();
                  }
                }
              } catch(e) { setState(() => _err = e); }
            });
          } catch(e) { setState(() => _err = e); }
        });
      } catch(e) { setState(() => _err = e); }
    }();
  }

  Future<void> _play() async {
    try {
      _played++;
      _player = VideoPlayerController.file(File('$_adir/$_played.mp4'));
      await _player.initialize();
      await _player.play();
      _player.addListener(() {
        if (_player.value.position == _player.value.duration) {
          _playing = false;
          if (_received > _played) {
            _play();
          } else {
            setState((){});
          }
        }
      });
      _playing = true;
      setState((){});
    } catch(e) { setState(() => _err = e); }
  }

  @override dispose() {
    _server.close(force: true);
    _player.dispose();
    super.dispose();
  }

  @override build(context) {
    if (_err != null) return Center(child: Text(_err.toString()));
    if (!_playing) return Center(child: Text('Lisening port $SRV_PORT...'));
    return Column(children: [
      Text('$_played.mp4'),
      Expanded(child: AspectRatio(
        aspectRatio: _player.value.aspectRatio,
        child: VideoPlayer(_player),
      ))
    ]);
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
