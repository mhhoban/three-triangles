var map;
var largeInfowindow;
var markers;

function fetchFsData(FsId) {
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

function venueCategory(name) {
  var self = this;
  self.name = name;
}

function initMap() {
  // Code adapted from GoogleMaps API Udacity Course
  // Constructor creates a new map
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
    venueImage: venueData.bestPhoto.prefix +
                '100' +
                'x' +
                '100' +
                venueData.bestPhoto.suffix,
    venueAddress: venueData.location.address,
    venuePhone: venueData.contact.formattedPhone,
    animation: google.maps.Animation.DROP,
  });

  marker.addListener('click', function() {
    showInfoWindow(this, largeInfowindow);
  });
  marker.setMap(map);
  markers.push(marker);
}

function showInfoWindow(marker, infowindow) {

  if (infowindow.marker != marker){
    var windowContent = '<strong>' + marker.title + '</strong>';
    windowContent += '<div>' + marker.venueAddress + '<div>';
    windowContent += '<div>' + marker.venuePhone + '</div>';
    windowContent += '<div><img src=' + marker.venueImage + '></div>';

    infowindow.marker = marker;
    infowindow.setContent(windowContent);
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }

}

function appViewModel() {
  var self = this;

  self.categoryPool = [
    new venueCategory("All"),
    new venueCategory("Entertainment"),
    new venueCategory("Food"),
    new venueCategory("Bars")
  ];

  self.categories = ko.observableArray();

  for (i = 0; i < self.categoryPool.length; i++){
    self.categories.push(self.categoryPool[i]);
  }

  self.selectedCategory = ko.observableArray();

  self.attractionPool = [
    new attraction("Paramount Theatre", "Entertainment", 37.809704, -122.268197, '49f00938f964a52029691fe3'),
    new attraction("Drake's Dealership", "Bar", 37.812621, -122.266326, '55a6eee8498e39b5dd60f45a'),
    new attraction("Burrito Express", "Food", 37.814114, -122.268600, '505d1ad6e4b0e43317e6a416'),
    new attraction("The New Parkway Theater", "Entertainment", 37.813787, -122.267439, '4f2c9d97e4b010c5f4f9ec08'),
    new attraction("The Double Standard", "Bar", 37.814274, -122.268234, '54c488ab498ed093fab467a3')
  ];

  self.attractions = ko.observableArray();

  for (i = 0; i < self.attractionPool.length; i++){
    self.attractions.push(self.attractionPool[i]);
    fetchFsData(self.attractionPool[i].FsId);
  }

  self.loadMarker = function(_attraction) {
    fetchFsData(_attraction.FsId);
  }

}

ko.applyBindings(new appViewModel());
