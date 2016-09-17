var map;

var self = this;
var places = [
	{title: 'Sweetgrass Bakery', location: {lat: 46.589938, lng: -112.038616}},
	{title: 'Park Avenue Bakery', location: {lat: 46.586355,lng: -112.040753}},
	{title: 'Cafe Zydeco', location: {lat: 46.5961329,lng: -112.034301}},
	{title: 'Suds Hut', location: {lat: 46.6128834,lng: -112.0211412}},
	{title: 'Jade Garden', location: {lat: 46.6170219,lng: -112.0211496}},
	{title: 'MacKenzie River Pizza Co.', location: {lat: 46.6181675,lng: -112.0211826}}
];
var markers = ko.observableArray([]);

var Place = function(place, i) {
	this.title = place.title;
	this.marker = markers[i];
}

var query = ko.observable('');

self.filteredMarkers = ko.computed(function() {
	// var search = this.query().toLowerCase();
	return markers().filter(function(fmarker) {
		if(!query() || fmarker.title.toLowerCase().indexOf(query().toLowerCase()) !== -1)
			return fmarker;
	});
}, this);

// These are the locations that will be shown to the user.
var ViewModel = function() {

	var self = this;

	var styles = [
		{
				"featureType": "administrative",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "off"
						}
				]
		},
		{
				"featureType": "administrative",
				"elementType": "geometry.stroke",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "administrative",
				"elementType": "labels",
				"stylers": [
						{
								"visibility": "on"
						},
						{
								"color": "#716464"
						},
						{
								"weight": "0.01"
						}
				]
		},
		{
				"featureType": "administrative.country",
				"elementType": "labels",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "landscape",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "landscape.natural",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "landscape.natural.landcover",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "geometry.fill",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "geometry.stroke",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "labels.text",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi",
				"elementType": "labels.text.stroke",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "poi.attraction",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "road",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "road.highway",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "off"
						}
				]
		},
		{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
						{
								"visibility": "simplified"
						},
						{
								"color": "#a05519"
						},
						{
								"saturation": "-13"
						}
				]
		},
		{
				"featureType": "road.local",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "transit",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "simplified"
						}
				]
		},
		{
				"featureType": "transit.station",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "water",
				"elementType": "all",
				"stylers": [
						{
								"visibility": "simplified"
						},
						{
								"color": "#84afa3"
						},
						{
								"lightness": 52
						}
				]
		},
		{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		},
		{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": [
						{
								"visibility": "on"
						}
				]
		}
];

	self.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		styles: styles
	});

	//Create variable to contain the infowindow for each marker
	var foodWindow = new google.maps.InfoWindow();

	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('0091ff');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');

	for (var i = 0; i < places.length; i++) {
		// Get the position from the location array.
		var lat = places[i].location;
		var title = places[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: lat,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});

		markers.push(marker);

		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			var marker = this;
			foodWindow.setContent("<div> This fantastic location is: <strong>" + marker.title + "</strong></div>");
			foodWindow.open(map, marker);
			toggleDrop(this);
			document.getElementById("yelpDiv").innerHTML = '<p>' + marker.title + '</p>';
		});

		// Add bounce effect to currently clicked icon
		function toggleDrop(marker) {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.DROP);
					marker.setIcon(highlightedIcon);
					setTimeout(function() {
						marker.setIcon(defaultIcon);
					}, 1500);
				}
		}

		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

	}

	// This function will loop through the markers array and display them all.
	function showMarkers() {
		var bounds = new google.maps.LatLngBounds();
		// Extend the boundaries of the map for each marker and display the marker
		for (var i = 0; i < markers().length; i++) {
			markers()[i].setMap(self.map);
			bounds.extend(markers()[i].position);
		}
		self.map.fitBounds(bounds);
	}

	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			'|40|_|%E2%80%A2',
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21,34));
		return markerImage;
	}

	showMarkers();

};

// This function is designed to activate the marker on click for anything that
// isn't the marker.
function remoteMarker(place) {
	var marker = place.marker;
	google.maps.event.trigger(this, 'click');

}

function initMap() {
    var vm = new ViewModel();
    ko.applyBindings(vm);
}
