//import 'model/CameraWeb.dart';
import 'model/CameraFlutter.dart';
import 'dao/PlacesDaoFirestore.dart';

//class Camera extends CameraWeb {}
class Camera extends CameraFlutter {}

class PlacesDao extends PlacesDaoFirestore {}

const APP_TITLE = 'Заброшенные места';
const LOADING_PART_SIZE = 20;
