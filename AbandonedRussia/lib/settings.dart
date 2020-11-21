import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

const bool ALLOW_EDIT_ALL = true;
const int LOADING_PART_SIZE = 1;

const int THUMBNAIL_SIZE = 80;
const int THUMBNAIL_COUNT_IN_LIST = 4;

const double LABEL_BUTTON_HEIGHT = 32;
const double LABEL_BUTTON_SPACE = kIsWeb ? 10 : 10;
final LABEL_BUTTON_STYLE = TextButton.styleFrom(
  minimumSize: Size(25, 25),
  padding: EdgeInsets.zero,
);

const DONE = ConnectionState.done;
