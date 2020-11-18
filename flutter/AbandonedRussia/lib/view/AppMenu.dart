import 'package:flutter/material.dart';

import '../view/LabelsEdit.dart';

class AppMenu extends StatelessWidget {
  final _itemTextStyle = TextStyle(fontSize: 16);

  @override
  build(context) => ListView(
        children: [
          ListTile(
              title: Text('О программе', style: _itemTextStyle),
              onTap: () async {
                await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => Scaffold(
                        appBar: AppBar(title: Text('О программе')),
                        body: Column(children: [
                          Padding(
                              padding: EdgeInsets.all(10),
                              child: Text(
                                'Публичная, пополняемая пользователями база данных объектов с фотографиями, текстовыми и гео- метками. Данные сохраняются в firestore-firebase / firestore-cloud с анонимной авторизацией. Можно редактировать и удалять только свои объекты. Привязка объекта к пользователю сохраняется до момента смены устройства, переустановки приложения, смены браузера, или удаления куков.',
                              )),
                          Padding(
                              padding: EdgeInsets.all(10),
                              child: Text(
                                'Ограничения WEB-версии:\n- Не сохраняются оригиналы фотографий (нет плагина firebase_cloud).\n- Не работает фоновый ресайзинг фотографий (во flutter-web не реализованы изоляты), поэтому интерфейс "залипает" при одобрении фото.\n- Нет возможности выбрать фото из файла (нет плагина image_picker, и падает плагин file_picker).\n',
                              )),
                        ]),
                      ),
                    ));
                Navigator.pop(context);
              }),
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
