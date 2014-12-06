/* Chèch Lajan
*
* /app.js - client entry point
*
* started @ 03/12/14
*/

( function( $, FastClick ) {

    "use strict";

    window.app.now = new Date();

    $( function() {
        FastClick( document.body );

        console.log( window.app );
        console.log( "ready." );
    } );

} )( require( "jquery" ), require( "fastclick" ) );
