class Place {
  String id;
  DateTime created;
  String creator;
  String title;
  String description;
  List<String> labels;
  List<String> images;

  Place({this.title, this.description, this.labels, this.images});

  Place.fromMap(String id, Map<String, dynamic> data) {
    this.id = id;
    created = data['created'];
    creator = data['creator'];
    title = data['title'];
    description = data['description'];
    labels = data['labels'];
    images = data['images'];
  }

  Map<String, dynamic> toMap() => {
        'created': created,
        'creator': creator,
        'title': title,
        'description': description,
        'labels': labels,
        'images': images,
      };
}
