var map;
var largeInfowindow;

function fetchFsData(FsId) {
  // data = $.get("https://api.foursquare.com/v2/venues/4e89194b5503e6f0b702249f")
  data = $.ajax({url: "https://api.foursquare.com/v2/venues/" + FsId,
               data: {client_id:'',
                client_secret:'',
                v:20170101},
                success: function(result) {
                  console.log('Query complete');
                  console.log(result.response);
                  showAttraction(result.response.venue);
                }
              });

}

function attraction(name, category, lat, lng, FsId) {
  var self = this;
  self.name = name;
  self.category = category;
  self.lat = lat;
  self.lng = lng;
  self.FsId = FsId;

}

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.811437, lng: -122.266787},
    zoom: 16
  });

  largeInfowindow = new google.maps.InfoWindow();
}

function showAttraction(venueData) {
  // Code adapted from GoogleMaps API Udacity Course
  var marker = new google.maps.Marker({
    position: {lat: venueData.location.lat, lng: venueData.location.lng},
    title: venueData.name,
    animation: google.maps.Animation.DROP,
    id: 1

  });

  marker.addListener('click', function() {
    showInfoWindow(this, largeInfowindow);
  });
  marker.setMap(map);
}

function showInfoWindow(marker, infowindow) {

  if (infowindow.marker != marker){

    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }

}

function appViewModel() {
  var self = this;

  self.attractions = ko.observableArray([
    new attraction("Paramount Theatre", "Entertainment", 37.809704, -122.268197, '49f00938f964a52029691fe3'),
    new attraction("Drake's Dealership", "Bar", 37.812621, -122.266326, '55a6eee8498e39b5dd60f45a'),
    new attraction("Burrito Express", "Food", 37.814114, -122.268600, '505d1ad6e4b0e43317e6a416'),
    new attraction("The New Parkway Theater", "Entertainment", 37.813787, -122.267439, '4f2c9d97e4b010c5f4f9ec08'),
    new attraction("The Double Standard", "Bar", 37.814274, -122.268234, '54c488ab498ed093fab467a3')
  ]);

  // self.loadMarker = function(_attraction) { showAttraction(_attraction.lat,
  //                                                          _attraction.lng,
  //                                                          _attraction.name) };
  self.loadMarker = function(_attraction) {
    fetchFsData(_attraction.FsId);
  }


}

ko.applyBindings(new appViewModel());
