var map;

function attraction(name, lat, lng) {
  var self = this;
  self.name = name;
  self.lat = lat;
  self.lng = lng;

}

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.811437, lng: -122.266787},
    zoom: 16
  });
}

function appViewModel() {
  var self = this;

  self.attractions = ko.observableArray([
    new attraction('Arbitrary place', 1, 2),
    new attraction('Another Arbitrary Place', 3, 4)
  ]);

}

ko.applyBindings(new appViewModel());
