/* Chèch Lajan
*
* /router.js - backbone router
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    jeolok        = require( "jeolok" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var MapView = require( "./views/map" );
var TerminalsListView = require( "./views/terminals-list" );
var TerminalDetailsView = require( "./views/terminal-details" );

var TerminalModel = require( "./models/terminal" );
var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: { },

    routes: {
        "terminals/list/:radius/:latitude/:longitude": "showTerminalsList",
        "terminals/details/:id": "showTerminalDetails",
        "admin": "showAdminList",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );
        var that = this;

        // 2. get geopos
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

            // On stocke la map et ses marqueurs
            window.app.currentPosition = oPosition;
            window.app.currentRadius = 5;

            // 3. launch router
            BackBone.history.start( {
                // pushState: true
            } );

            that.views.main.initMap( window.app.map = new MapView(oPosition, (BackBone.history.fragment == 'admin') ? 8 : 13 ) );
        } );
    },

    showTerminalsList: function ( fRadius, fLatitude, fLongitude ) {
        console.log( "showTerminalsList" );

        var that = this;

        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: fLatitude ? fLatitude : oPosition.latitude,
                        longitude: fLongitude ? fLongitude : oPosition.longitude,
                        radius : fRadius ? fRadius : window.app.currentRadius
                    },
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.list.setStatus( oTerminalsCollection.length + " résultats" );
                    }
                } );
    },

    showTerminalDetails: function ( sTerminalId ) {
        console.log( "showTerminalDetails:", sTerminalId );

        var that = this;

        var oTerminal = new TerminalModel( { id: sTerminalId } );
        (this.views.details = new TerminalDetailsView( oTerminal ) )
            .model
                .fetch( {
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initDetails( that.views.details.render() );
                    }
                } );
    },

    showAdminList: function() {
        console.log( "showTerminalsListAdmin" );

        var that = this;
        this.views.list.setStatus( "Chargement..." );

        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: oPosition.latitude,
                        longitude: oPosition.longitude,
                        radius : -1
                    },
                    success: function() {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.list.setStatus( oTerminalsCollection.length + " résultats" );
                    }
                } );
     }

} );
