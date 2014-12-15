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

        _tpl = $("#tpl-header").remove().text();
    },

    events: {
        "click #reload": "reloadButtonClicked",
        "click #list": "listButtonClicked",
    },
    render: function () {
        this.$el.html( _tpl );

        return this;
    }
});
