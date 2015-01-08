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

    el: "<div />",

    constructor: function (oTerminalsCollection) {
        BackBone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "TerminalListView:init()" );

        if (!_tpl) {
            _tpl = $("#tpl-result").remove().text();
        }
    },

    events: {},
    render: function () {
        this.$el
            .attr( "class", "overlay" )
            .html( _tpl );

        var list = this.$el.find( "ul" );
        console.log ("list");
        this.collection.each( function ( oTerminalModel ) {
            list.append( ( new TerminalElementView( oTerminalModel ) ).render().$el );
        } );

        return this;
    }
});
