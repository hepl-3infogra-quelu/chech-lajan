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

    loading: function ( bLoadingState ) {
        // TODO : visual Feedback
        if (bLoadingState) {
            console.log( "Chargement..." )
        }
        else {
            console.log( "Fini !" );
        }
    },

    clearContent: function () {
        // Cette méthode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find("#main div").remove();
    },

    initHeader: function ( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    initList: function ( TerminalListView ) {
        this.$el.find( "#main" ).append( TerminalListView.$el );
    },

    initDetails: function ( TerminalDetailsView ) {
        this.$el.find( "#main" ).append( TerminalDetailsView.$el );
    }
});
