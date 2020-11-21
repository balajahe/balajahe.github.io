import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
// import 'package:flutter/services.dart' show rootBundle;
// import 'package:flutter_linkify/flutter_linkify.dart';

import 'LabelsEdit.dart';

class AppMenu extends StatelessWidget {
  final _itemTextStyle = TextStyle(fontSize: 16);

  @override
  build(context) => ListView(
        children: [
          ListTile(
            title: Text('О программе', style: _itemTextStyle),
            onTap: () async {
              await launch('https://balajahe.github.io/AbandonedRussia/');
              Navigator.pop(context);
              // await Navigator.push(
              //     context,
              //     MaterialPageRoute(
              //       builder: (_) => Scaffold(
              //         appBar: AppBar(title: Text('О программе')),
              //         body: FutureBuilder(
              //           future: rootBundle.loadString('assets/about.txt'),
              //           builder: (context, snapshot) => (snapshot.hasData)
              //               ? Column(children: [
              //                   Padding(
              //                     padding: EdgeInsets.all(10),
              //                     child: Linkify(
              //                       text: snapshot.data,
              //                       onOpen: (link) => launch(link.url),
              //                     ),
              //                   ),
              //                 ])
              //               : WaitingOrError(error: snapshot.error),
              //         ),
              //       ),
              //     ));
              // Navigator.pop(context);
            },
          ),
          ListTile(
              title: Text('Редактировать метки', style: _itemTextStyle),
              onTap: () async {
                await Navigator.push(
                    context, MaterialPageRoute(builder: (_) => LabelsEdit()));
                Navigator.pop(context);
              }),
        ],
      );
}
