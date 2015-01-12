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

var iMaxSearchRadius = 40,
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
    }
    if ( oRequest.query.radius == -1 ) {
        iGivenRadius = 2000;
    } else {
        if( isNaN( iGivenRadius ) || iGivenRadius > iMaxSearchRadius ) {
            iGivenRadius = 5;
        }
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
            // Si administration
            if ( oRequest.query.radius == -1 ) {
                aSplicedTerminals = aCleanedTerminals;
            } else {
                aSplicedTerminals = aCleanedTerminals.splice( 0, 50 );
            }
            api.send( oRequest, oResponse, aSplicedTerminals );
        } );

};

var empty = function( oRequest, oResponse ) {
    Terminal
        .findById( oRequest.params.id )
        .exec( function( oError, oTerminal ) {
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !oTerminal ) {
                return api.error( oRequest, oResponse, "TERMINAL_UNKNOWN" );
            }
            oTerminal.empty = true;
            oTerminal.save( function( oError, oSavedTerminal ) {
                if( oError ) {
                    return api.error( oRequest, oResponse, oError.type, oError );
                }
                api.send( oRequest, oResponse, true );
            } );
        } );
};

var details = function( oRequest, oResponse ) {
    Terminal
        .findById( oRequest.params.id )
        .populate( "bank" )
        .exec( function( oError, oTerminal ) {
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !oTerminal ) {
                return api.error( oRequest, oResponse, "TERMINAL_UNKNOWN" );
            }
            api.send( oRequest, oResponse, oTerminal.clean() );
        } );
};

var newaddress = function( oRequest, oResponse ) {
    Terminal
        .findById( oRequest.params.id )
        .exec( function( oError, oTerminal ) {
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !oTerminal ) {
                return api.error( oRequest, oResponse, "TERMINAL_UNKNOWN" );
            }
            oTerminal.address = oRequest.params.address;
            oTerminal.latitude = oRequest.params.latitude;
            oTerminal.longitude = oRequest.params.longitude;
            oTerminal.save( function( oError, oSavedTerminal ) {
                if( oError ) {
                    return api.error( oRequest, oResponse, oError.type, oError );
                }
                api.send( oRequest, oResponse, true );
            } );
        } );
};

// Declare routes
exports.init = function ( oApp ) {
    oApp.get ( "/api/terminals", list );
    oApp.get ( "/api/terminals/:id", details );
    oApp.put ( "/api/terminals/:id/empty", empty );
    oApp.put ( "/api/terminals/:id/:address/:latitude/:longitude/newaddress", newaddress);
}
