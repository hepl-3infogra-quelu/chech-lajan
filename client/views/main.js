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
        console.log("TODO: clearContent");
    },
    
    initHeader: function ( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    initList: function () {
        console.log("TODO: initList");
    }
});
