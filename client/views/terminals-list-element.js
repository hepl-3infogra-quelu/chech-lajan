/* Chèch Lajan
*
* /views/terminal-list-element.js - backbone terminals element view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" ),
    jeyodistans   = require( "jeyo-distans" );

BackBone.$    = require( "jquery" );

var _tpl, marker;

module.exports = BackBone.View.extend({

    el: "<li />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        if ( !_tpl ) {
            _tpl = $("#tpl-result-list-elt").remove().text();
        }
    },

    events: {
        "click a": "showTerminal"
    },

    render: function () {
        var oBank = this.model.get("bank");

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        // Création des marqueurs

        var status = (this.model.get('empty')) ? 'empty' : 'money';
        var that = this;

        var marker = window.app.map.newMarker( {
            latitude: this.model.get('latitude'),
            longitude: this.model.get('longitude')
        }, status );

        google.maps.event.addListener( marker, 'click', function() {
            window.app.map.centerMap(marker.getPosition());
            window.app.router.navigate( "terminals/details/" + that.model.get( "id" ), true );
        } );

        window.app.map.markers.push( marker );

        this.$el
            .html( _tpl )
            .find( "a" )
                .find( "img" )
                    .attr( "src", oBank && oBank.icon ? "/banks/" + oBank.icon : "/banks/unknown.png" )
                    .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .find( "strong" )
                    .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                    .text( oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .find( "span.distance" )
                    .text( "~" + ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" );
        return this;
    },

    showTerminal: function ( e ) {
        e.preventDefault();
        window.app.router.navigate( "terminals/details/" + this.model.get( "id" ), { trigger: true } );
    }
});
