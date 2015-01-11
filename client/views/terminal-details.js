/* Chèch Lajan
*
* /views/terminal-details.js - backbone terminals details view
*
* started @ 19/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" ),
    jeyodistans   = require( "jeyo-distans" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<aside />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-details").remove().text();
        }
    },

    events: {
        "click .problems a": "toggleEmptyState",
        "click #refresh-me": "refreshPosition"
    },

    render: function (bUpdateMarker) {
        // Permet d'éviter une "empilation" de marqueur lors du refresh de position
        if (bUpdateMarker == undefined) {
            bUpdateMarker = true;
        }

        console.log('updatedAt');
        console.log(this.model.get("date"));

        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        // Création du marqueur

        if (bUpdateMarker) {
            var status = (this.model.get('empty')) ? 'empty' : 'money';

            window.app.map.markers.push(window.app.map.newMarker({
                latitude: oTerminalPosition.latitude,
                longitude: oTerminalPosition.longitude
            }, status, 'DROP', true));
        }

        this.$el
            .attr( "class", "col1" )
            .html( _tpl )
            .find("h2")
                .css( "background", "#" + ( (oBank && oBank.color) ? oBank.color : "333" ) )
                .end()
            .find(".triangle")
                .css( "border-top-color", "#" + ( (oBank && oBank.color) ? oBank.color : "333" ) )
                .end()
            .find("h2 strong")
                .text((oBank && oBank.name) ? oBank.name : "Inconnu")
                .end()
                .find("img")
                    .attr( "src", (oBank && oBank.icon) ? "/banks/" + oBank.icon : "/banks/unknown.png" )
                    .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
            .find( ".distance" )
                .text( "~" + ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
                .end()
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".empty" )
                .toggle( this.model.get( "empty" ) )
                .end()
            .find( ".problem" )
                // .toggle( this.model.get( "empty" ) )
                .end()
        return this;
    },

    toggleEmptyState: function ( e ) {
        e.preventDefault();
        var that = this;
        this.model.set( "empty", false );
        this.model.save( null, {
            "url": "/api/terminals/" + this.model.get( "id" ) + "/empty",
            "success": function() {
                that.$el
                    .find( "empty" )
                        .show()
                        .end()
                    .find( ".problems" )
                        .hide();
            }
        } );
    }
});
