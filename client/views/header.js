/* Chèch Lajan
*
* /views/header.js - backbone header view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<header />",

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "HeaderView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-header" ).remove().text();
        }
    },

    events: {
        "click #reload": "reloadButtonClicked"
    },

    render: function () {
        this.$el.html( _tpl );

        this.$status = this.$el.find( "#status" );

        return this;
    },

    loading: function( bLoadingState ) {
        this.$el.find( "#status" ).toggleClass( "loading", bLoadingState );
    },

    getStatus: function() {
        return this.$status.text();
    },

    setStatus: function( sText ) {
        this.$status.text( sText );
    },

    reloadButtonClicked: function( e ) {
        e.preventDefault();
        console.log( "reloadButtonClicked" );
    }
});
