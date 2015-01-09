/* Chèch Lajan
*
* /views/main.js - backbone main application view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

module.exports = BackBone.View.extend({

    el: "body",
    $el: $( "body" ),

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "MainView:init()" );

        // TODO : define private accessors to subviews
    },

    loading: function ( bLoadingState, sNewStatus ) {
        if( bLoadingState ) {
            this._status = window.app.router.views.header.getStatus();
            window.app.router.views.header.loading( true );
            window.app.router.views.header.setStatus( sNewStatus || "chargement..." );
        } else {
            window.app.router.views.header.loading( false );
            window.app.router.views.header.setStatus( sNewStatus );
        }
    },

    clearContent: function () {
        // Cette méthode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find("#main div:not(#status)" ).remove();
    },

    initHeader: function ( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    initList: function ( TerminalListView ) {
        this.$el.find( "#main" ).append( TerminalListView.$el );
    },

    initDetails: function ( TerminalDetailsView ) {
        this.$el.find( "#main" ).append( TerminalDetailsView.$el );
    },

    initMap: function ( MapView ) {
        MapView.render();
    }
});
