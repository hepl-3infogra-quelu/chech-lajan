/* Chèch Lajan
 *
 * /routes/api/terminals.js - express routes for terminals api calls
 *
 * started @ 03/11/14
 */

"use strict";

var root = __dirname + "/../..";

var api = require( root + "/core/middlewares/api.js" ),
    db = require( root + "/core/db.js" );

var Terminal = db.get( "Terminal" );

var iMaxSearchRadius = 20,
    iArcKilometer = 0.009259;
// [GET] /api/terminals

var list = function( oRequest, oResponse ) {
    var fLatitude = parseFloat( oRequest.query.latitude ),
        fLongitude = parseFloat( oRequest.query.longitude ),
        iGivenRadius = +oRequest.query.radius, // == parseInt(oRequest.query.radius, 10)
        iSearchRadiusSize,
        oPosition = {
            "latitude": fLatitude,
            "longitude": fLongitude
        };


    if ( !fLatitude || !fLongitude ) {
        return api.error( oRequest, oResponse, "TERMINALS_LIST_NO_POSITION_GIVEN", oRequest.query );
    };
    if ( isNaN( iGivenRadius ) || iGivenRadius > iMaxSearchRadius ) {
        iGivenRadius = 5;
    }
    iSearchRadiusSize = iArcKilometer * iGivenRadius;
    
    Terminal
        .find( {
            "latitude": {
                "$gt": fLatitude - iSearchRadiusSize,
                "$lt": fLatitude + iSearchRadiusSize
            },
            "longitude": {
                "$gt": fLongitude - iSearchRadiusSize,
                "$lt": fLongitude + iSearchRadiusSize
            }
        })
        .populate( "bank" )
        .exec( function( oError, aTerminals ) {
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !aTerminals ) {
                aTerminals = [];
            }
            var aCleanedTerminals = [],
                aSplicedTerminals;
            aTerminals.forEach( function( oTerminal ) {
                aCleanedTerminals.push( oTerminal.clean( oPosition ) )
            } );
            aCleanedTerminals.sort( function( oOne, oTwo ) {
                return oOne.distance - oTwo.distance;
            } );
            aSplicedTerminals = aCleanedTerminals.splice( 0, 10 );
            api.send( oRequest, oResponse, aSplicedTerminals );
        } );

};

var empty = function( oRequest, oResponse ) {
    Terminal
        .findById( oRequest.params.id )
        .exec(function( oError, oTerminal ) {
            if ( !oTerminal ) {
                return api.error( oRequest, oResponse, "TERMINAL_UNKNOWN" );
            }
            if ( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            oTerminal.empty = true;
            oTerminal.save( function( oError, oSavedTerminal ) {
                if (oError) {
                    return api.error( oRequest, oResponse, oError.type, oError );
                };
                api.send( oRequest, oResponse, true);
            } );
        });
};

// Declare routes
exports.init = function ( oApp ) {
    oApp.get ( "/api/terminals", list );
    oApp.put ( "/api/terminals/:id/empty", empty );
}