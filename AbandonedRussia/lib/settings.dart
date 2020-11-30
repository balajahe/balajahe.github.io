import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

const String ALLOW_EDIT_ALL = '9dd5ffce83bbcf635bdfb7bb9abfecd1';
const int LOAD_PART_SIZE = 4;
const int LOAD_INDEX_PART_SIZE = 100;

const int THUMBNAIL_SIZE = 80;
const int THUMBNAIL_COUNT_IN_LIST = 4;

const double LABEL_BUTTON_HEIGHT = 32;
const double LABEL_BUTTON_SPACE = kIsWeb ? 10 : 10;
final LABEL_BUTTON_STYLE = TextButton.styleFrom(
  minimumSize: Size(25, 25),
  padding: EdgeInsets.zero,
);

const DONE = ConnectionState.done;
