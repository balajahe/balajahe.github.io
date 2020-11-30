import 'package:flutter/material.dart';

class PaddingText extends StatelessWidget {
  final String text;
  final TextStyle style;
  final double top;
  final double left;
  final bool selectable;
  PaddingText(this.text,
      {this.style, this.top = 2, this.left = 5, this.selectable = false});

  @override
  build(context) => Padding(
      padding: EdgeInsets.only(top: top, left: left),
      child: (selectable)
          ? SelectableText(text, style: style)
          : Text(text, style: style));
}

class GroupSeparator extends StatelessWidget {
  final String _text;
  GroupSeparator(this._text);

  @override
  build(context) => Container(
        child: Row(children: [
          Text('$_text: ',
              style: TextStyle(
                  fontSize: 12,
                  fontStyle: FontStyle.normal,
                  color: Colors.grey[600])),
          Expanded(
            child: Container(
                height: 1,
                margin: EdgeInsets.only(top: 10),
                color: Colors.grey[400]),
          ),
        ]),
      );
}

class WaitingOrError extends StatelessWidget {
  final dynamic error;
  final bool transparent;
  WaitingOrError({this.error, this.transparent = false});

  @override
  build(context) => (error == null)
      ? transparent
          ? _WaitingTransparent()
          : _Waiting()
      : _Error(error);
}

class _Waiting extends StatelessWidget {
  @override
  build(context) => Container(
      padding: EdgeInsets.only(top: 10),
      child: Center(child: CircularProgressIndicator()));
}

class _WaitingTransparent extends StatelessWidget {
  @override
  build(context) => Container(
      padding: EdgeInsets.only(top: 10),
      color: Color(0xAAAAAAAA),
      child: Center(child: CircularProgressIndicator()));
}

class _Error extends StatelessWidget {
  final dynamic error;
  _Error(this.error);

  @override
  build(context) {
    var stackTrace = '';
    try {
      stackTrace = error.stackTrace.toString();
    } catch (_) {}
    return Padding(
        padding: EdgeInsets.only(top: 10),
        child: SelectableText('ОШИБКА: ${error.toString()}\n$stackTrace'));
  }
}

class ErrorScreen extends StatelessWidget {
  final dynamic error;
  ErrorScreen(this.error);

  @override
  build(context) {
    var stackTrace = '';
    try {
      stackTrace = error.stackTrace.toString();
    } catch (_) {}
    return Scaffold(
        body: SafeArea(
            child: SingleChildScrollView(
                child: Center(
                    child: SelectableText(
                        'ОШИБКА: ${error.toString()}\n$stackTrace')))));
  }
}

void startWaiting(context) => Navigator.of(context).push(
      PageRouteBuilder(
        fullscreenDialog: true,
        opaque: false,
        pageBuilder: (_, __, ___) => WaitingOrError(transparent: true),
      ),
    );

void stopWaiting(context) => Navigator.of(context).pop();

Future<void> showError(context, dynamic error) async => await Navigator.push(
      context,
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (_) => ErrorScreen(error),
      ),
    );
