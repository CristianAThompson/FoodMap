var map;

var self = this;
var places = [
	{title: 'Park Avenue Bakery', location: {lat: 46.586355,lng: -112.040753}},
	{title: 'Suds Hut', location: {lat: 46.6128834,lng: -112.0211412}},
	{title: 'Jade Garden', location: {lat: 46.6170219,lng: -112.0211496}},
	{title: 'MacKenzie River Pizza Co.', location: {lat: 46.6181675,lng: -112.0211826}},
	{title: "Lucca's", location: {lat: 46.5885769,lng: -112.0389549}},
	{title: 'Firehouse Coffee House', location: {lat: 46.5912034,lng: -112.0374789}}
];
var markers = ko.observableArray([]);

// defines the observable to be used to capture the user search input
var query = ko.observable('');

// filters the markers using a forced lowercase evaluation between query and each title in the list
var filteredMarkers = ko.computed(function() {
	return markers().filter(function(fmarker) {
		if(!query() || fmarker.title.toLowerCase().indexOf(query().toLowerCase()) !== -1){
			fmarker.setVisible(true);
			return fmarker;
		} else {
			fmarker.setVisible(false);
		}
	});
}, this);

// These are the locations that will be shown to the user.
var ViewModel = function() {

	var self = this;

	var styles = [
		{
        "featureType": "administrative",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "visibility": "on"
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
        "featureType": "water",
        "stylers": [
            {
                "color": "#abbaa4"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3f518c"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "color": "#ad9b8d"
            }
        ]
    }
];
	// defines the initial map and zoom level
	var map = new google.maps.Map(document.getElementById('map'), {
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
			icon: "markers/crossed-knife-and-fork.png"
		});

		markers.push(marker);

		// Create an onclick event to open the large infowindow at each marker and
		// calls the ajax request on click to query foursquare for the menu and locations
		// information.
		marker.addListener('click', function() {
			var marker = this;
			$.ajax({
					type: 'GET',
					dataType: 'jsonp',
					url: "https://api.foursquare.com/v2/venues/search?query=" + marker.title + "&near=Helena+MT&client_id=GWJ522P5CWHSKMEU3YUXCRVBKYWWFRCTFAYMLPPIY4OPDRLH&client_secret=OVELCGKYUQV3JJEGAZSRHKN0CFV52P4I5OKQNHBFZCBHHSN1&v=20160917"
			}).done(function(response) {
				foodWindow.setContent("<div> This fantastic location is: <strong>" + marker.title + "</strong>"+
				"</div><br><br><div style='text-align: center'>" + response.response.venues[0].location.formattedAddress +
				"<br> <a href='" + response.response.venues[0].menu.mobileUrl + "'>Click for the menu!</a></div><br>" +
				"<div style='text-align: center'>Location and Menu from <a href='http://www.foursquare.com'>FourSquare</a></div>");
				foodWindow.open(map, marker);
			}).fail(function(jqXHR) {
					alert('Error: ' + jqXHR.status + ' - Service Currently Unavailable (Try again later)');
			});
			toggleDrop(this);
		});

		// Add bounce effect to currently clicked icon
		function toggleDrop(marker) {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.DROP);
					marker.setIcon("markers/crossed-knife-and-fork-highlighted.png");
					setTimeout(function() {
						marker.setIcon("markers/crossed-knife-and-fork.png");
					}, 1750);
				}
		}

		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon("markers/crossed-knife-and-fork-highlighted.png");
		});
		marker.addListener('mouseout', function() {
			this.setIcon("markers/crossed-knife-and-fork.png");
		});

	}

	// This function will loop through the markers array and display them all.
	function showMarkers() {
		var bounds = new google.maps.LatLngBounds();
		// Extend the boundaries of the map for each marker and display the marker
		for (var i = 0; i < filteredMarkers().length; i++) {
			filteredMarkers()[i].setMap(map);
			bounds.extend(filteredMarkers()[i].position);
		}
		map.fitBounds(bounds);
	}

	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			"markers/crossed-knife-and-fork.png"
		)
		return markerImage;
	}

	showMarkers();

};

// This function is designed to activate the marker on click for the list items
function remoteMarker() {
	google.maps.event.trigger(this, 'click');

}

function googleError() {
	alert("There was an error loading the map!");
}

// allows the initial google maps callback to initialize the ViewModel
function initMap() {
    var vm = new ViewModel();
    ko.applyBindings(vm);
}


// Fork and Knife Icons Attribution: http://www.flaticon.com/free-icon/restaurant_93192#term=fork&page=1&position=46 by Freepik
