(function ( $ ) {
	"use strict";

	var gMap,
		$map;

	var _initMap = function () {
		var oMapOptions = {
			zoom: 15,
			disableDefaultUI: true,
			zoomControl: true,
			scrollWheel: false
		};
		gMap = new google.maps.Map( $map[ 0 ], oMapOptions );
	}

	var _newMarker = function(oPosition, sType, sAnimation) {
		var sAnimation = (sAnimation)? sAnimation : 'DROP';

		new google.maps.Marker({
			position: new google.maps.LatLng(oPosition.coords.latitude, oPosition.coords.longitude),
			map: gMap,
			animation: google.maps.Animation[ sAnimation.toUpperCase() ],
			icon: 'img/marker-' + sType + '.png'
		});
	}

	var _populateMap = function() {
		
	};

	var _getPositionSuccess = function(oPosition) {
		var oPos = new google.maps.LatLng(oPosition.coords.latitude,
					oPosition.coords.longitude);

		var oPosition2 = {
			coords: {
				latitude: oPosition.coords.latitude - 0.001,
				longitude: oPosition.coords.longitude + 0.007
			}
		};
		var oPosition3 = {
			coords: {
				latitude: oPosition.coords.latitude - 0.005,
				longitude: oPosition.coords.longitude - 0.00546
			}
		};
		var oPosition4 = {
			coords: {
				latitude: oPosition.coords.latitude + 0.004,
				longitude: oPosition.coords.longitude + 0.0042
			}
		};

		_newMarker(oPosition, 'me', 'bounce');
		_newMarker(oPosition2, 'money');
		_newMarker(oPosition3, 'empty');
		_newMarker(oPosition4, 'broke');

		_populateMap();

		gMap.setCenter(oPos);
	};

	var _getPositionError = function(oError) {
		if (oError) {
			var sContent = 'Error: Le service de géolocalisation a rencontré une erreur.';
		} else {
			var sContent = 'Error: Votre navigateur ne supporte pas la géolocalisation.';
		}

		var oOptions = {
			map: gMap,
			position: new google.maps.LatLng(60, 105),
			content: sContent
		};

		var infowindow = new google.maps.InfoWindow(oOptions);
		gMap.setCenter(oOptions.position);
	};

	$( function() {
		$map = $( '#map-canvas' );
		_initMap();

		navigator.geolocation && 
		navigator.geolocation.getCurrentPosition( _getPositionSuccess, _getPositionError, {
			"enableHighAccuracy": true
		} );
	} );

})( jQuery );
