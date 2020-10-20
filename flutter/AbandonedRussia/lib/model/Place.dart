import '../model/AppUser.dart';

class Place {
  String id;
  AppUser creator;
  DateTime created;
  String title;
  String description;
  List<String> labels;
  List<String> images;

  Place(
      {this.id,
      this.creator,
      this.created,
      this.title,
      this.description,
      this.labels,
      this.images});
}
