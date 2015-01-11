/* Chèch Lajan
*
* /views/header.js - backbone header view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    jeolok        = require( "jeolok" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<div />",

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "HeaderView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-header" ).remove().text();
        }
    },

    events: {
        "click #refresh": "refreshPosition",
        "click #list": "showList"
    },

    render: function () {
        this.$el.html( _tpl );

        return this;
    },

    refreshPosition: function ( e ) {
        e.preventDefault();

        var that = this;

        // On récupère une nouvelle position
        var oPosition;
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    latitude: 50.84274,
                    longitude: 4.35154
                };
            }
            else {
                oPosition = oGivenPosition.coords;
            }

            // On met à jour la nouvelle position actuelle
            window.app.currentPosition = oPosition;

            // On raffraichit et recentre la map
            window.app.map.refresh(oPosition);

            // On raffraichit la distance du terminal
            window.app.router.navigate( "", true );
        } );
    },

    showList: function ( e ) {
        e.preventDefault();

        window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + window.app.currentPosition.latitude + "/" + window.app.currentPosition.longitude, true );
    }
});
