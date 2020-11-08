import 'package:flutter/foundation.dart';

import 'model/CameraAbstract.dart';
import 'model/CameraFlutter.dart';
import 'model/CameraWebStub.dart' if (dart.library.html) 'model/CameraWeb.dart';

import 'dao/PlacesDaoFirestore.dart';

CameraAbstract cameraFactory() => kIsWeb ? CameraWeb() : CameraFlutter();

class PlacesDao extends PlacesDaoFirestore {}

const APP_TITLE = 'Заброшенные места';
const LOADING_PART_SIZE = 20;
