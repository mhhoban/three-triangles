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

function showAttraction(marLat, marLng, marTitle) {
  var marker = new google.maps.Marker({
    position: {lat: marLat, lng: marLng},
    title: marTitle,
    animation: google.maps.Animation.DROP,
    id: 1

  });

  marker.setMap(map);
}

function appViewModel() {
  var self = this;

  self.attractions = ko.observableArray([
    new attraction("Paramount Theatre", 37.809704, -122.268197),
    new attraction("Drake's Dealership", 37.812621, -122.266326),
    new attraction("Burrito Express", 37.814114, -122.268600),
    new attraction("The New Parkway Theater", 37.813787, -122.267439),
    new attraction("The Double Standard", 37.814274, -122.268234)
  ]);

  self.loadMarker = function(_attraction) { showAttraction(_attraction.lat,
                                                           _attraction.lng,
                                                           _attraction.name) };

}

ko.applyBindings(new appViewModel());
