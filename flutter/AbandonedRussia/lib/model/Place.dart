class Place {
  String id;
  DateTime created;
  String creator;
  String title;
  String description;
  List<String> images;
  List<String> labels;

  Place({this.title, this.description, this.labels, this.images});

  Place.fromMap(String id, Map<String, dynamic> data) {
    this.id = id;
    created = data['created'];
    creator = data['creator'];
    title = data['title'];
    description = data['description'];
    images = data['images'];
    labels = data['labels'];
  }
}
