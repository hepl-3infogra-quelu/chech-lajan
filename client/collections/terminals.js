/* Chèch Lajan
*
* /collections/terminals.js - backbone collections for terminal
*
* started @ 12/12/14
*/

"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

module.exports = BackBone.Collection.extend({

    url: "/api/terminals",
    model: require("../models/terminal"),

    parse: function (oResponse) {
        // TODO handle errors
        return oResponse.data;
    }

});
