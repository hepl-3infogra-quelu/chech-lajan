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

    el: "<div />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-details").remove().text();
        }
    },

    events: {
        "click .problems a": "toggleEmptyState"
    },

    render: function () {
        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        this.$el
            .html( _tpl )
            .attr( "class", "overlay" )
            .find("h2")
                .css( "color", "#" + ( (oBank && oBank.color) ? oBank.color : "333" ) )
                .text((oBank && oBank.name) ? oBank.name : "Inconnu")
                .end()
                    .find("h2 img")
                        .attr( "src", oBank && oBank.icon ? "/images/banks/" + oBank.icon : "images/banks/unknown.png" )
                        .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                        .end()
            .find( "span" )
                .text( ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".empty" )
                .toggle(this.model.get("empty"))
                .end()
            ;
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
                    .find( ".empty" )
                        .show()
                        .end()
                    .find( ".problems" )
                        .hide();
            }
        } );
    }
});
