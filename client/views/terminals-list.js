/* Chèch Lajan
*
* /views/terminal-list.js - backbone terminals list view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;
var TerminalElementView = require("./terminals-list-element");

module.exports = BackBone.View.extend({

    el: "<aside />",

    constructor: function (oTerminalsCollection) {
        BackBone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "TerminalListView:init()" );

        if (!_tpl) {
            _tpl = $( "#tpl-result" ).remove().text();
        }
    },

    events: {
        "change #radius": "changeRadius"
    },

    setStatus: function ( sStatut ) {
        this.$el.find( "#status .text" ).text(sStatut);
    },

    render: function () {
        this.$el
            .attr( "class", "col1" )
            .html( _tpl );

        var $list = this.$el.find( "ul" );

        this.$el.find( "#radius" ).val( window.app.currentRadius );

        this.collection.each( function ( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );

        return this;
    },

    changeRadius: function ( e ) {
        window.app.currentRadius = e.target.value;
        window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + window.app.currentPosition.latitude + "/" + window.app.currentPosition.longitude, true );
    }
});
