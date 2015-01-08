/* Chèch Lajan
*
* /views/terminal-details.js - backbone terminals details view
*
* started @ 19/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" ),
    jeyodistans   = require( "jeyo-distans" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<div />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-details").remove().text();
        }
    },

    events: {
        "click .problems a": "toggleEmptyState"
    },

    render: function () {
        var oBank = this.model;

        this.$el
            .attr( "class", "overlay" )
            .html( _tpl )
            .find("h2")
            .css("color", "#" + oBank.color)
            .text((oBank && oBank.name) ? oBank.name : "Inconnu")
            .end()
                .find("h2 img")
                    .attr( "src", "banks/" + oBank.icon )
                    .attr( "alt", (oBank && oBank.name) ? oBank.name : "Inconnu" )
                    .end()
            .find( "span" )
                .text( ( parseFloat( this.model.distance ) * 1000 ) + "m" )
            .find( ".empty" )
                .toggle(this.model.get("empty"))
                .end()
            ;
        return this;
    },

    toggleEmptyState: function () {
        a.preventDefault();
        this.model.set( "empty", false);
        this.model.save(null, {
            success: function () {

            }
        })
    }
});
