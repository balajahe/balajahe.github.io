class Person {
  final String nameFirst;
  final String nameLast;

  final String streetName;
  final String city;
  final String state;
  final String country;
  //final double postcode;

  final String email;
  final String phone;

  final String pictureThumbnail;

  Person.fromJSON(Map<String, dynamic> json)
      : nameFirst = json['name']['first'],
        nameLast = json['name']['last'],
        streetName = json['location']['street']['name'],
        city = json['location']['city'],
        state = json['location']['state'],
        country = json['location']['country'],
        //postcode = json['location']['postcode'],
        email = json['email'],
        phone = json['phone'],
        pictureThumbnail = json['picture']['thumbnail'];

  get name => this.nameFirst + ' ' + this.nameLast;

  get address =>
      // this.postcode +
      // ', ' +
      this.streetName +
      ', ' +
      this.city +
      ', ' +
      this.state +
      ', ' +
      this.country;
}
