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
        "click .showProblems": "showProblems",
        "click #empty_terminal": "toggleEmptyState",
        "click #modif_terminal": "editTerminal",
        "click #save_terminal": "saveTerminal"
    },

    render: function () {
        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        var status = (this.model.get('empty')) ? 'empty' : 'money';

        window.app.map.markers.push(window.app.map.newMarker({
            latitude: oTerminalPosition.latitude,
            longitude: oTerminalPosition.longitude
        }, status, 'DROP', true));

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
                .text( "~" + parseInt( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
                .end()
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".problem" )
                .toggle( this.model.get( "empty" ) )
                .end()
            .find( ".problems-container" )
                .toggle( !this.model.get( "empty" ) )
                .end()
            .find( ".problems" )
                .toggle( this.model.get( "empty" ) )
                .end();
        return this;
    },

    showProblems: function ( e ) {
        e.preventDefault();

        $(".problems").toggle();
    },

    toggleEmptyState: function( e ) {
        e.preventDefault();

        var that = this;

        if ( window.confirm( "Voulez vous vraiment mettre ce distributeur à jour ?" ) ) {
            this.model.set("empty", true );
            this.model.save( null, {
                url: "/api/terminals/" + this.model.get( "id" ) + "/empty",
                success: function() {
                    that.render();
                }
            } );
        }
    },

    editTerminal: function ( e ) {
        e.preventDefault();

        $(".editInfo").toggle();

        window.app.map.initSearchBox();
    },

    saveTerminal: function ( e ) {
        var newAddress = window.app.map.getSearchPostion();
        var that = this;
        if (newAddress) {
            this.model.save( null, {
                url: "/api/terminals/" + this.model.get( "id" ) +
                     "/" + newAddress.address +
                     "/" + newAddress.coords.lat() +
                     "/" + newAddress.coords.lng() + "/newaddress",
                success: function() {
                    window.app.map.deleteMarker(window.app.map.markers[0]);
                    window.app.router.showTerminalDetails( that.model.get( "id" ) );
                }
            } );
        } else {
            $("#error_address").show();
        }
    }
});
