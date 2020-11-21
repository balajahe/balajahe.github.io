class Person {
  final String nameFirst;
  final String nameLast;

  final String streetName;
  final String city;
  final String state;
  final String country;
  final String postcode;

  final String email;
  final String phone;

  final String pictureThumbnail;
  final String pictureLarge;

  Person.fromJSON(Map<String, dynamic> json)
      : nameFirst = json['name']['first'],
        nameLast = json['name']['last'],
        streetName = json['location']['street']['name'],
        city = json['location']['city'],
        state = json['location']['state'],
        country = json['location']['country'],
        postcode = json['location']['postcode'].toString(),
        email = json['email'],
        phone = json['phone'],
        pictureThumbnail = json['picture']['thumbnail'],
        pictureLarge = json['picture']['large'];

  String get name => this.nameFirst + ' ' + this.nameLast;

  String get address =>
      this.postcode +
      ', ' +
      this.streetName +
      ', ' +
      this.city +
      ', ' +
      this.state +
      ', ' +
      this.country;
}
