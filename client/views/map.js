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

    constructor: function (oPosition) {
        BackBone.View.apply( this, arguments );

        console.log( "MapView:init()" );

        this.$map = $( '#map-canvas' );
        this.initMap();

        this.setPosition(oPosition);
    },

    events: { },

    render: function () {
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

    newMarker: function(oPosition, sType, sAnimation) {
        var sAnimation = (sAnimation)? sAnimation : 'DROP';

        new google.maps.Marker({
            position: new google.maps.LatLng(oPosition.latitude, oPosition.longitude),
            map: this.gMap,
            animation: google.maps.Animation[ sAnimation.toUpperCase() ],
            icon: 'img/marker-' + sType + '.png'
        });
    },

    setPosition: function(oPosition) {
        var oPos = new google.maps.LatLng(oPosition.latitude,
                    oPosition.longitude);

        this.newMarker(oPosition, 'me', 'bounce');

        this.gMap.setCenter(oPos);
    }
});
