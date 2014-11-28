"use strict";

(function () {
	var map;

	function initialize() {
		var mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(50.846686, 4.352425),
			disableDefaultUI: true,
			zoomControl: true
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	}

	function setNewMarker(position, type) {
		var pos = new google.maps.LatLng(position.coords.latitude,
			position.coords.longitude);

		var image = 'img/marker-' + type + '.png';

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			map: map,
			animation: google.maps.Animation.DROP,
			icon: image
		});
	}

	function handleNoGeolocation(errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: map,
			position: new google.maps.LatLng(60, 105),
			content: content
		};

		var infowindow = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	}
	window.onload = function () {
		initialize();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				var pos = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude);

				setNewMarker(position, 'me');
				var position2 = {
					coords: {
						latitude: 50.5289202,
						longitude: 5.7160795
					}
				};
				var position3 = {
					coords: {
						latitude: 50.5220202,
						longitude: 5.7160495
					}
				};
				var position4 = {
					coords: {
						latitude: 50.5320452,
						longitude: 5.7264295
					}
				};
				setNewMarker(position2, 'money');
				setNewMarker(position3, 'empty');
				setNewMarker(position4, 'broke');

				map.setCenter(pos);
			}, function () {
				handleNoGeolocation(true);
			});
		} else {
			handleNoGeolocation(false);
		}
	}

})();
