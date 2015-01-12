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

// Declare routes
exports.init = function( oApp ) {
    oApp.get( "/", homepage );
};
