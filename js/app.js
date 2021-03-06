var map,
    LargeInfoWindow,
    defaultMarkIcon,
    selectedMarkIcon,
    markerVenueDict = {},
    bounds;

function fetchFsData(FsId) {
  // Timeout erroring adapted from http://stackoverflow.com/questions/17156332/jquery-ajax-how-to-handle-timeouts-best
  console.log('fetchFsData requesting');
  data = $.ajax({url: "https://api.foursquare.com/v2/venues/" + FsId,
               data: {client_id:'I0T4VBKSDZU5F1HYLGWH1OTTWAYSZHHNO0SZJQK04BFFJHDD',
                client_secret:'2JNZY1MCFOJWG33ZTMYZJBJJUPVM2TUMLQZLMIPBO44NUOCI',
                v:20170101},
                timeout: 2000,
                success: function(result) {
                  console.log('FS Ajax Request Complete');
                  addAttractionData(result.response.venue, FsId);
                },
                error: function(){
                  apiError();
                }
              });
}

function apiError() {
  alert("An error has occurred. Please try reloading the page. If the error persists, please try back again later.");
}

function Attraction(name, category, lat, lng, FsId) {
  var self = this;
  self.name = name;
  self.category = category;
  self.lat = lat;
  self.lng = lng;
  self.FsId = FsId;

}

function VenueCategory(name) {
  var self = this;
  self.name = name;
}

function makeMarkerIcon(markerColor) {
  // Code from GoogleMaps API Udacity Course

  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function initMap() {
  // Code adapted from GoogleMaps API Udacity Course
  defaultMarkIcon = makeMarkerIcon('ff0000');
  selectedMarkIcon = makeMarkerIcon('3333ff');
  bounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.811437, lng: -122.266787},
    zoom: 15
  });

  LargeInfoWindow = new google.maps.InfoWindow();
  ko.applyBindings(new AppViewModel());
}

function clearMap() {
  for (site in markerVenueDict){
    if (site){
      markerVenueDict[site][0].setMap(null);
    }
  }
}

function resetIcons(){
  for (site in markerVenueDict){
    markerVenueDict[site][0].setIcon(defaultMarkIcon);
  }
}

function addAttractionSite(site) {
  // Code adapted from GoogleMaps API Udacity Course

  var marker = new google.maps.Marker({
    position: {lat: site.lat, lng: site.lng},
    title: site.name,
    icon: defaultMarkIcon,
    FsId: site.FsId,
    animation: google.maps.Animation.DROP,
  });

  marker.addListener('click', function() {
    showInfoWindow(this, LargeInfoWindow);
  });
  marker.setMap(null);

  markerVenueDict[site.FsId] = [];
  markerVenueDict[site.FsId].push(marker);

  console.log(markerVenueDict);
}

function addAttractionData(venueData, FsId){
  // add the fetched data
  markerVenueDict[FsId].push({title: venueData.name,
                              venueImage: venueData.bestPhoto.prefix +
                                              '100' +
                                              'x' +
                                              '100' +
                                              venueData.bestPhoto.suffix,
                              venueAddress: venueData.location.address,
                              venuePhone: venueData.contact.formattedPhone});
  //call the show info window field again now that we've added the venue data:
  showInfoWindow(markerVenueDict[FsId][0], LargeInfoWindow);

}

function showMarker(id) {
  markerVenueDict[id][0].setMap(map);
  bounds.extend(markerVenueDict[id][0].position);
  map.fitBounds(bounds);
}

function showInfoWindow(marker, infowindow) {

  if(markerVenueDict[marker.FsId][1]){
    // display venue info if it has been fetched through the FourSquare API
    if (infowindow.marker != marker){
      map.panTo(marker.getPosition())
      venueData = markerVenueDict[marker.FsId][1];
      resetIcons();

      venueData.title ? title = venueData.title : title = 'No Title Available';
      venueData.venueAddress ? venueAddress = venueData.venueAddress : venueAddress = 'No Address Available';
      venueData.venuePhone ? venuePhone = venueData.venuePhone : venuePhone = 'No Phone Number Available';
      venueData.venueImage ? venueImage = venueData.venueImage : venueImage = 'No Image Available';

      var windowContent = '<strong>' + title + '</strong>';
      windowContent += '<div>' + venueAddress + '<div>';
      windowContent += '<div>' + venuePhone + '</div>';
      windowContent += '<div><img src=' + venueImage + '></div>';

      infowindow.marker = marker;
      marker.setIcon(selectedMarkIcon);
      infowindow.setContent(windowContent);
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        resetIcons();
        infowindow.marker = null;
      });
    }
  }

  else {
    // grab FourSquare data if venue is being clicked on for first time
    fetchFsData(marker.FsId);
  }

}

function AppViewModel() {
  var self = this;

  self.categoryPool = [
    new VenueCategory("All"),
    new VenueCategory("Entertainment"),
    new VenueCategory("Food"),
    new VenueCategory("Bar")
  ];

  self.categories = ko.observableArray();

  for (i = 0; i < self.categoryPool.length; i++){
    self.categories.push(self.categoryPool[i]);
  }

  self.selectedCategory = ko.observable();

  self.attractionPool = [
    new Attraction("Paramount Theatre", "Entertainment", 37.809704, -122.268197, '49f00938f964a52029691fe3'),
    new Attraction("Drake's Dealership", "Bar", 37.812621, -122.266326, '55a6eee8498e39b5dd60f45a'),
    new Attraction("Burrito Express", "Food", 37.814114, -122.268600, '505d1ad6e4b0e43317e6a416'),
    new Attraction("The New Parkway Theater", "Entertainment", 37.813787, -122.267439, '4f2c9d97e4b010c5f4f9ec08'),
    new Attraction("The Double Standard", "Bar", 37.814274, -122.268234, '54c488ab498ed093fab467a3')
  ];

  self.attractions = ko.observableArray();

  for (i = 0; i < self.attractionPool.length; i++){
    addAttractionSite(self.attractionPool[i]);
  }

  self.venueClicked = function(venueChoice){
    console.log('venue click registering');
    showInfoWindow(markerVenueDict[venueChoice.FsId][0],LargeInfoWindow)
  }

  self.selectedCategory.subscribe(function(_selection){
    if (_selection != undefined){
      self.switchCategory(_selection.name);
    }
  });

  self.switchCategory = function(newCategory){
    clearMap();
    self.attractions.removeAll();

    if (newCategory == 'All'){
      for (i = 0; i < self.attractionPool.length; i++){
        self.attractions.push(self.attractionPool[i]);
        showMarker(self.attractionPool[i].FsId);
      }
    }

    else{
      for (i = 0; i < self.attractionPool.length; i++){
        if (self.attractionPool[i].category == newCategory){
          self.attractions.push(self.attractionPool[i]);
          showMarker(self.attractionPool[i].FsId);
        }
      }
    }

  };

}
