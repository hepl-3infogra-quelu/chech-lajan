/* Chèch Lajan
*
* /views/terminal-list-element.js - backbone terminals element view
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

    el: "<li />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );
        this.model = oTerminalModel;

        console.log( "TerminalListElementView:init()" );

        _tpl = $("#tpl-result-list-elt").remove().text();
    },

    events: {
        "click a": "showTerminal"
    },

    render: function () {
        var oBank = this.model.get("bank");
        this.$el
            .html( _tpl )
            .find("a")
                .find("img")
                    .attr("src", "images/banks/" + oBank.icon + ".png")
                    .attr("alt", oBank.name)
                    .end()
                .find("strong")
                    .css("color", "#" + oBank.color)
                    .text(oBank.name)
                    .end()
                .find("span")
                    .text( ( parseFloat( this.model.distance ) * 1000 ) + "m" );
        return this;
    },

    showTerminal: function (e) {
        e.preventDefault();
        console.log( "TODO: showTerminal" );
    }
});
