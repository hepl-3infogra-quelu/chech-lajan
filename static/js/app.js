(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Chèch Lajan
*
* /app.js - client entry point
*
* started @ 03/12/14
*/

"use strict";

var $           = require( "jquery" ),
    FastClick   = require( "fastclick" ),
    Router      = require( "./router" );

window.app.now = new Date();

$( function() {
    FastClick( document.body );

    console.log( window.app );
    console.log( "ready." );

    window.app.router = new Router();
    window.app.router.start();
} );

},{"./router":4,"fastclick":"fastclick","jquery":"jquery"}],2:[function(require,module,exports){
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

},{"../models/terminal":3,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],3:[function(require,module,exports){
/* Chèch Lajan
*
* /models/terminal.js - backbone model for terminal
*
* started @ 12/12/14
*/

"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

module.exports = BackBone.Model.extend( {

    urlRoot: "/api/terminals",

    parse: function (oResponse) {
        // TODO handle errors
        if (oResponse.data && oResponse.url) {
            return oResponse.data
        }
        else {
            return oResponse
        }
        return oResponse.data;
    }

});

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],4:[function(require,module,exports){
/* Chèch Lajan
*
* /router.js - backbone router
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    jeolok        = require( "jeolok" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var MapView = require( "./views/map" );
var TerminalsListView = require( "./views/terminals-list" );
var TerminalDetailsView = require( "./views/terminal-details" );

var TerminalModel = require( "./models/terminal" );
var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: { },

    routes: {
        "terminals/list/:radius/:latitude/:longitude": "showTerminalsList",
        "terminals/details/:id": "showTerminalDetails",
        "admin": "showAdminList",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );
        var that = this;

        // 2. get geopos
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    latitude: 50.84274,
                    longitude: 4.35154
                };
            }
            else {
                oPosition = oGivenPosition.coords;
            }

            // On stocke la map et ses marqueurs
            window.app.currentPosition = oPosition;
            window.app.currentRadius = 5;

            // 3. launch router
            BackBone.history.start( {
                // pushState: true
            } );

            that.views.main.initMap( window.app.map = new MapView(oPosition, (BackBone.history.fragment == 'admin') ? 8 : 13 ) );
        } );
    },

    showTerminalsList: function ( fRadius, fLatitude, fLongitude ) {
        console.log( "showTerminalsList" );

        var that = this;

        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: fLatitude ? fLatitude : oPosition.latitude,
                        longitude: fLongitude ? fLongitude : oPosition.longitude,
                        radius : fRadius ? fRadius : window.app.currentRadius
                    },
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.list.setStatus( oTerminalsCollection.length + " résultats" );
                    }
                } );
    },

    showTerminalDetails: function ( sTerminalId ) {
        console.log( "showTerminalDetails:", sTerminalId );

        var that = this;

        var oTerminal = new TerminalModel( { id: sTerminalId } );
        (this.views.details = new TerminalDetailsView( oTerminal ) )
            .model
                .fetch( {
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initDetails( that.views.details.render() );
                    }
                } );
    },

    showAdminList: function() {
        console.log( "showTerminalsListAdmin" );

        var that = this;
        this.views.list.setStatus( "Chargement..." );

        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: oPosition.latitude,
                        longitude: oPosition.longitude,
                        radius : -1
                    },
                    success: function() {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.list.setStatus( oTerminalsCollection.length + " résultats" );
                    }
                } );
     }

} );

},{"./collections/terminals":2,"./models/terminal":3,"./views/header":5,"./views/main":6,"./views/map":7,"./views/terminal-details":8,"./views/terminals-list":10,"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
/* Chèch Lajan
*
* /views/header.js - backbone header view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    jeolok        = require( "jeolok" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<div />",

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "HeaderView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-header" ).remove().text();
        }
    },

    events: {
        "click #refresh": "refreshPosition",
        "click #list": "showList",
        "click #admin": "showAdmin"
    },

    render: function () {
        this.$el.html( _tpl );

        return this;
    },

    refreshPosition: function ( e ) {
        e.preventDefault();

        var that = this;

        // On récupère une nouvelle position
        var oPosition;
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    latitude: 50.84274,
                    longitude: 4.35154
                };
            }
            else {
                oPosition = oGivenPosition.coords;
            }

            // On met à jour la nouvelle position actuelle
            window.app.currentPosition = oPosition;

            // On raffraichit et recentre la map
            window.app.map.refresh(oPosition);
            window.app.map.gMap.setZoom( 13 );

            // On raffraichit la distance du terminal
            window.app.router.navigate( "", true );

        } );
    },

    showList: function ( e ) {
        e.preventDefault();

        window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + window.app.currentPosition.latitude + "/" + window.app.currentPosition.longitude, true );
    },

    showAdmin: function ( e ) {
        e.preventDefault();

        window.app.router.navigate( "admin", true );
        window.app.map.gMap.setZoom( 8 );
    }
});

},{"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
/* Chèch Lajan
*
* /views/main.js - backbone main application view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

module.exports = BackBone.View.extend({

    el: "body",
    $el: $( "body" ),

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "MainView:init()" );

        // TODO : define private accessors to subviews
    },

    loading: function ( bLoadingState, sNewStatus ) {
        // if( bLoadingState ) {
        //     this._status = window.app.router.views.header.getStatus();
        //     window.app.router.views.header.loading( true );
        //     window.app.router.views.header.setStatus( sNewStatus || "chargement..." );
        // } else {
        //     window.app.router.views.header.loading( false );
        //     window.app.router.views.header.setStatus( sNewStatus );
        // }
    },

    clearContent: function () {
        // Cette méthode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find("#main aside:not(#map-canvas)" ).remove();

        // On cache les marqueurs avant de les supprimer (Restent visibles sinon)
        for (var i = 0; i < window.app.map.markers.length; i++) {
            if(!window.app.map.markers[i].title){
                window.app.map.markers[i].setMap(null);
            }
        }
        window.app.map.markers = new Array();
    },

    initHeader: function ( HeaderView ) {
        this.$el.find( "#header" ).append( HeaderView.$el );
    },

    initList: function ( TerminalListView ) {
        this.$el.find( "#main" ).prepend( TerminalListView.$el );
    },

    initDetails: function ( TerminalDetailsView ) {
        this.$el.find( "#main" ).prepend( TerminalDetailsView.$el );
    },

    initMap: function ( MapView ) {
        MapView.render();
    }
});

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
/* Chèch Lajan
*
* /views/map.js - backbone map view
*
* started @ 09/01/15
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<div />",
    gMap: null,
    $map: null,
    markers: [],
    positionMarker: null,
    searchBox: null,
    zoom: null,

    constructor: function (oPosition, zoom) {
        BackBone.View.apply( this, arguments );

        console.log( "MapView:init()" );

        this.zoom = zoom;
        this.$map = $( '#map-canvas' );
        this.initMap();

        this.setPosition(oPosition);
    },

    events: { },

    render: function () {
        this.$el.html( _tpl ).attr( "id", "map-canvas" );

        this.$status = this.$el.find( "#status" );

        return this;
    },

    loading: function( bLoadingState ) {
        this.$el.find( "#status" ).toggleClass( "loading", bLoadingState );
    },

    initMap: function () {
        var oMapOptions = {
            zoom: this.zoom,
            disableDefaultUI: true,
            zoomControl: true,
            scrollWheel: false
        };
        this.gMap = new google.maps.Map( this.$map[ 0 ], oMapOptions );
    },

    newMarker: function(oPosition, sType, sAnimation, bCenter, bDraggable) {
        var oPos = new google.maps.LatLng( oPosition.latitude, oPosition.longitude );
        var sAnimation = (sAnimation)? sAnimation : 'DROP';
        if ( bCenter) {
            this.gMap.setCenter(oPos);
        }
        if ( bDraggable === undefined ) {
            bDraggable = false;
        }

        return new google.maps.Marker({
            position: oPos,
            map: this.gMap,
            animation: google.maps.Animation[ sAnimation.toUpperCase() ],
            icon: new google.maps.MarkerImage( '/img/marker-' + sType + '.png', null, null, null, new google.maps.Size( 40, 57 ) ),
            draggable: bDraggable
        });
    },

    deleteMarker: function (oMarker) {
        oMarker.setMap(null);
        oMarker = null;
    },

    setPosition: function(oPosition) {
        if (this.positionMarker) {
            google.maps.event.clearInstanceListeners(this.positionMarker);
            this.positionMarker.setMap(null);
            this.positionMarker = null;
        }
        this.positionMarker = this.newMarker( oPosition, 'me', 'bounce', true, true );

        var that = this;

        // On écoute l'événement de déplacement du marqueur de position
        google.maps.event.addListener(this.positionMarker, 'dragend', function() {
            var oPosition = {
                latitude: that.positionMarker.getPosition().lat(),
                longitude: that.positionMarker.getPosition().lng()
            };
            window.app.currentPosition = oPosition;
            window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + oPosition.latitude + "/" + oPosition.longitude, true );
        });
    },

    centerMap: function(oPosition) {
        this.gMap.setCenter(oPosition);
    },

    refresh: function (oPosition) {
        var oPos = new google.maps.LatLng( oPosition.latitude, oPosition.longitude );

        this.setPosition(oPosition);
        this.centerMap(oPos);

        console.log('refresh');
    },

    initSearchBox: function () {
        var input = document.getElementById( "addressBox" );

        this.searchBox = new google.maps.places.Autocomplete(input);

        this.searchBox.bindTo('bounds', this.gMap);
    },

    getSearchPostion: function () {
        var place = this.searchBox.getPlace();

        if (place) {
            var oPosition = new google.maps.LatLng( place.geometry.location.k, place.geometry.location.D )

            this.centerMap(oPosition);

            return {
                coords: oPosition,
                address: place.formatted_address
            };
        } else {
            return false;
        }

    }
});

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
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

    el: "<aside />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-details").remove().text();
        }
    },

    events: {
        "click .showProblems": "showProblems",
        "click #empty_terminal": "toggleEmptyState",
        "click #modif_terminal": "editTerminal",
        "click #save_terminal": "saveTerminal"
    },

    render: function () {
        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        var status = (this.model.get('empty')) ? 'empty' : 'money';

        window.app.map.markers.push(window.app.map.newMarker({
            latitude: oTerminalPosition.latitude,
            longitude: oTerminalPosition.longitude
        }, status, 'DROP', true));

        this.$el
            .attr( "class", "col1" )
            .html( _tpl )
            .find("h2")
                .css( "background", "#" + ( (oBank && oBank.color) ? oBank.color : "333" ) )
                .end()
            .find(".triangle")
                .css( "border-top-color", "#" + ( (oBank && oBank.color) ? oBank.color : "333" ) )
                .end()
            .find("h2 strong")
                .text((oBank && oBank.name) ? oBank.name : "Inconnu")
                .end()
                .find("img")
                    .attr( "src", (oBank && oBank.icon) ? "/banks/" + oBank.icon : "/banks/unknown.png" )
                    .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
            .find( ".distance" )
                .text( "~" + parseInt( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
                .end()
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".problem" )
                .toggle( this.model.get( "empty" ) )
                .end()
            .find( ".problems-container" )
                .toggle( !this.model.get( "empty" ) )
                .end()
            .find( ".problems" )
                .toggle( this.model.get( "empty" ) )
                .end();
        return this;
    },

    showProblems: function ( e ) {
        e.preventDefault();

        $(".problems").toggle();
    },

    toggleEmptyState: function( e ) {
        e.preventDefault();

        var that = this;

        if ( window.confirm( "Voulez vous vraiment mettre ce distributeur à jour ?" ) ) {
            this.model.set("empty", true );
            this.model.save( null, {
                url: "/api/terminals/" + this.model.get( "id" ) + "/empty",
                success: function() {
                    that.render();
                }
            } );
        }
    },

    editTerminal: function ( e ) {
        e.preventDefault();

        $(".editInfo").toggle();

        window.app.map.initSearchBox();
    },

    saveTerminal: function ( e ) {
        var newAddress = window.app.map.getSearchPostion();
        var that = this;
        if (newAddress) {
            this.model.save( null, {
                url: "/api/terminals/" + this.model.get( "id" ) +
                     "/" + newAddress.address +
                     "/" + newAddress.coords.lat() +
                     "/" + newAddress.coords.lng() + "/newaddress",
                success: function() {
                    window.app.map.deleteMarker(window.app.map.markers[0]);
                    window.app.router.showTerminalDetails( that.model.get( "id" ) );
                }
            } );
        } else {
            $("#error_address").show();
        }
    }
});

},{"backbone":"backbone","jeyo-distans":"jeyo-distans","jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
/* Chèch Lajan
*
* /views/terminal-list-element.js - backbone terminals element view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    BackBone      = require( "backbone" ),
    jeyodistans   = require( "jeyo-distans" );

BackBone.$    = require( "jquery" );

var _tpl, marker;

module.exports = BackBone.View.extend({

    el: "<li />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        if ( !_tpl ) {
            _tpl = $("#tpl-result-list-elt").remove().text();
        }
    },

    events: {
        "click a": "showTerminal"
    },

    render: function () {
        var oBank = this.model.get("bank");

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        // Création des marqueurs

        var status = (this.model.get('empty')) ? 'empty' : 'money';
        var that = this;

        var marker = window.app.map.newMarker( {
            latitude: this.model.get('latitude'),
            longitude: this.model.get('longitude')
        }, status );

        google.maps.event.addListener( marker, 'click', function() {
            window.app.map.centerMap(marker.getPosition());
            window.app.router.navigate( "terminals/details/" + that.model.get( "id" ), true );
        } );

        window.app.map.markers.push( marker );

        this.$el
            .html( _tpl )
            .find( "a" )
                .find( "img" )
                    .attr( "src", oBank && oBank.icon ? "/banks/" + oBank.icon : "/banks/unknown.png" )
                    .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .find( "strong" )
                    .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                    .text( oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .find( "span.distance" )
                    .text( "~" + parseInt( ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) ) + "m" );
        return this;
    },

    showTerminal: function ( e ) {
        e.preventDefault();
        window.app.router.navigate( "terminals/details/" + this.model.get( "id" ), true );
    }
});

},{"backbone":"backbone","jeyo-distans":"jeyo-distans","jquery":"jquery","underscore":"underscore"}],10:[function(require,module,exports){
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

    el: "<aside />",

    constructor: function (oTerminalsCollection) {
        BackBone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "TerminalListView:init()" );

        if (!_tpl) {
            _tpl = $( "#tpl-result" ).remove().text();
        }
    },

    events: {
        "change #radius": "changeRadius"
    },

    setStatus: function ( sStatut ) {
        this.$el.find( "#status .text" ).text(sStatut);
    },

    render: function () {
        this.$el
            .attr( "class", "col1" )
            .html( _tpl );

        var $list = this.$el.find( "ul" );

        this.$el.find( "#radius" ).val( window.app.currentRadius );

        this.collection.each( function ( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );

        return this;
    },

    changeRadius: function ( e ) {
        window.app.currentRadius = e.target.value;
        window.app.router.navigate( "terminals/list/" + window.app.currentRadius + "/" + window.app.currentPosition.latitude + "/" + window.app.currentPosition.longitude, true );
    }
});

},{"./terminals-list-element":9,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);
