import 'package:flutter/foundation.dart';

import 'model/CameraAbstract.dart';
import 'model/CameraMobile.dart';
import 'model/CameraWebStub.dart' if (dart.library.html) 'model/CameraWeb.dart';

CameraAbstract CameraFactory() => kIsWeb ? CameraWeb() : CameraMobile();

const String APP_TITLE = 'Заброшенные места';
const int LOADING_PART_SIZE = 20;
const int THUMBNAIL_WIDTH = 70;
