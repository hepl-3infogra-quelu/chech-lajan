/* Chèch Lajan
*
* /views/map.js - backbone map view
*
* started @ 09/01/15
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<div />",
    gMap: null,
    $map: null,
    markers: [],
    positionMarker: null,

    constructor: function (oPosition) {
        BackBone.View.apply( this, arguments );

        console.log( "MapView:init()" );

        this.$map = $( '#map-canvas' );
        this.initMap();

        this.setPosition(oPosition);
    },

    events: { },

    render: function () {
        this.$el.html( _tpl ).attr( "id", "map-canvas" );

        this.$status = this.$el.find( "#status" );

        return this;
    },

    loading: function( bLoadingState ) {
        this.$el.find( "#status" ).toggleClass( "loading", bLoadingState );
    },

    initMap: function () {
        var oMapOptions = {
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true,
            scrollWheel: false
        };
        this.gMap = new google.maps.Map( this.$map[ 0 ], oMapOptions );
    },

    newMarker: function(oPosition, sType, sAnimation, bCenter, bDraggable) {
        var oPos = new google.maps.LatLng( oPosition.latitude, oPosition.longitude );
        var sAnimation = (sAnimation)? sAnimation : 'DROP';
        if ( bCenter) {
            this.gMap.setCenter(oPos);
        }
        if ( bDraggable === undefined ) {
            bDraggable = false;
        }

        return new google.maps.Marker({
            position: oPos,
            map: this.gMap,
            animation: google.maps.Animation[ sAnimation.toUpperCase() ],
            icon: '/img/marker-' + sType + '.png',
            draggable: bDraggable
        });
    },

    setPosition: function(oPosition) {
        if (this.positionMarker) {
            google.maps.event.clearInstanceListeners(this.positionMarker);
            this.positionMarker.setMap(null);
            this.positionMarker = null;
        }
        this.positionMarker = this.newMarker( oPosition, 'me', 'bounce', true, true );

        var that = this;

        // On écoute l'événement de déplacement du marqueur de position
        google.maps.event.addListener(this.positionMarker, 'dragend', function() {
            var oPosition = {
                latitude: that.positionMarker.getPosition().lat(),
                longitude: that.positionMarker.getPosition().lng()
            };
            window.app.currentPosition = oPosition;
            window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + oPosition.latitude + "/" + oPosition.longitude, true );
        });
    },

    centerMap: function(oPosition) {
        this.gMap.setCenter(oPosition);
    },

    refresh: function (oPosition) {
        var oPos = new google.maps.LatLng( oPosition.latitude, oPosition.longitude );

        this.setPosition(oPosition);
        this.centerMap(oPos);

        console.log('refresh');
    }
});
