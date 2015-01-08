/* Chèch Lajan
*
* /router.js - backbone router
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    jeolok        = require( "jeolok" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var TerminalsListView = require( "./views/terminals-list" );
var TerminalDetailsView = require( "./views/terminal-details" );

var TerminalModel = require( "./models/terminal" );
var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: {

    },

    routes: {
        "terminals/list": "showTerminalsList",
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalDetails",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );

        // 2. get geopos
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            // console.log(oGivenPosition);
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    latitude: 50.84274,
                    longitude: 4.35154
                }
            }
            else {
                oPosition = oGivenPosition.coords;
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
        var oTerminalsCollection = new TerminalsCollection( oPosition );
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: 50.84274,
                        longitude: 4.35154
                        // latitude: oPosition.latitude,
                        // longitude: oPosition.longitude
                    },
                    success: function () {
                        console.log( "collection fetch done" )
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.main.loading( false );
                    }
                } );
    },

    showTerminalsMap: function () {
        console.log( "showTerminalsMap" );
    },

    showTerminalDetails: function ( sTerminalId ) {
        console.log( "showTerminalDetails:", sTerminalId );
        var that = this;
        this.views.main.loading( true );
        var oTerminal = new TerminalModel( { id: sTerminalId } );
        (this.views.details = new TerminalDetailsView( oTerminal ) )
            .model
                .fetch( {
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initDetails( that.views.details.render() );
                        console.log( "Model successfully fetched" )
                        this.views.main.loading( false );
                    }
                } );
    }
} );
