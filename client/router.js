/* Chèch Lajan
*
* /router.js - backbone router
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" )
    jeolock = require("jeolock");

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var TerminalsListView = require( "./views/terminals-list" );

var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: {

    },

    routes: {
        "terminals/list": "showTerminalsList",
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalsDetails",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );

        // 2. get geopos
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            console.log(oGivenPosition);
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    lattitude: 50.84274,
                    longitude: 4.35154
                }
            }
        } );

        // 3. launch router
        BackBone.history.start( {
            pushState: true
        } );
    },

    showTerminalsList: function () {
        console.log( "showTerminalsList" );

        var that = this;
        this.views.main.loading(true);
        var oTerminalsCollection = TerminalsCollection( oPosition );
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: oPosition.latitude,
                        longitude: oPosition.longitude
                    },
                    success: function () {
                        console.log( "collection fetch done" )
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.main.loading(false);
                    }
                } );
    },

    showTerminalsMap: function () {
        console.log( "showTerminalsMap" );
    },

    showTerminalsDetails: function () {
        console.log( "showTerminalsDetails" );
    }
} );
