import 'package:flutter/foundation.dart';

import 'model/CameraAbstract.dart';
import 'model/CameraFlutter.dart';
import 'model/CameraWeb.dart';

import 'dao/PlacesDaoFirestore.dart';

CameraAbstract getCamera() => kIsWeb ? CameraWeb() : CameraFlutter();

class PlacesDao extends PlacesDaoFirestore {}

const APP_TITLE = 'Заброшенные места';
const LOADING_PART_SIZE = 20;
