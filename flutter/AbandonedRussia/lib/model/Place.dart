class Place {
  String id;
  DateTime created;
  String creator;
  String title;
  String description;
  List<String> labels;
  List<String> images;

  Place(
      {this.id,
      this.created,
      this.creator,
      this.title,
      this.description,
      this.labels,
      this.images});
}
