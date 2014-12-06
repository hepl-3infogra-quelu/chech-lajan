/* Chèch Lajan
 *
 * /routes/pages.js - express routes for static pages
 *
 * started @ 03/11/14
 */

"use strict";

// [GET] / - homepage
var homepage = function( oRequest, oResponse ) {
    oResponse.sendFile( require( "path" ).resolve( root + "/../static/app.html" ) );
};

// [GET] /jade.test - serving jade file for test purposes
var showFirstJade = function( oRequest, oResponse ) {
    oResponse.render( "index.jade", {
        firstname: "Luc",
        lastname: "Matagne",
        age: 22,
        cats: [
            { name: "Eclypse", gender: "female" },
            { name: "Lili", gender: "female" },
            { name: "Luna", gender: "female" }
        ]
    } );
};

// Declare routes
exports.init = function( oApp ) {
    oApp.get( "/", homepage );
    oApp.get( "/jade.test", showFirstJade );
};
