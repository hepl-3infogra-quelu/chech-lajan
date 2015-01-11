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
    jeolok        = require( "jeolok" ),
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

},{"../models/terminal":3,"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],3:[function(require,module,exports){
/* Chèch Lajan
*
* /models/terminal.js - backbone model for terminal
*
* started @ 12/12/14
*/

"use strict";

var _             = require( "underscore" ),
    jeolok        = require( "jeolok" ),
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

},{"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],4:[function(require,module,exports){
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
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalDetails",
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
            that.views.main.initMap( window.app.map = new MapView(oPosition) );

            // 3. launch router
            BackBone.history.start( {
                pushState: true
            } );

        } );
    },

    showTerminalsList: function ( fRadius, fLatitude, fLongitude ) {
        console.log( "showTerminalsList" );

        var that = this;
        this.views.main.loading(true);
        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: fLatitude ? fLatitude : oPosition.latitude,
                        longitude: fLongitude ? fLongitude : oPosition.longitude,
                        radius : fRadius ? fRadius : 3
                    },
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.list.setStatus( oTerminalsCollection.length + " résultats" );
                    }
                } );
    },

    showTerminalsMap: function () {
        console.log( "showTerminalsMap" );
    },

    showTerminalDetails: function ( sTerminalId ) {
        console.log( "showTerminalDetails:", sTerminalId );
        var that = this;
        this.views.main.loading( true );
        var oTerminal = new TerminalModel( { id: sTerminalId } );
        (this.views.details = new TerminalDetailsView( oTerminal ) )
            .model
                .fetch( {
                    success: function () {
                        that.views.main.clearContent();
                        that.views.main.initDetails( that.views.details.render() );
                        that.views.main.loading( false );
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
        "click #list": "showList"
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

            // On raffraichit la distance du terminal
            that.render(false);
        } );
    },

    showList: function ( e ) {
        e.preventDefault();

        window.app.router.navigate( "", true );
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

    constructor: function (oPosition) {
        BackBone.View.apply( this, arguments );

        console.log( "MapView:init()" );

        this.$map = $( '#map-canvas' );
        this.initMap();

        this.setPosition(oPosition);

        var that = this;

        // On écoute l'événement de déplacement du marqueur de position
        google.maps.event.addListener(this.positionMarker, 'dragend', function() {
            var oPos = that.positionMarker.getPosition();
            console.log(oPos);
            that.setPosition(oPos);
            window.app.router.navigate( "terminals/list/5/" + oPos.k + "/" + oPos.D, { trigger: true } );
        });
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
            zoom: 15,
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
            icon: '/img/marker-' + sType + '.png',
            draggable: bDraggable
        });
    },

    setPosition: function(oPosition) {
        if (this.positionMarker) {
            this.positionMarker.setMap(null);
            this.positionMarker = null;
        }
        this.positionMarker = this.newMarker( oPosition, 'me', 'bounce', true, true );
    },

    refresh: function (oPosition) {
        var oPos = new google.maps.LatLng( oPosition.latitude, oPosition.longitude );

        google.maps.event.trigger(this.gMap, 'resize');
        this.setPosition(oPosition);
        this.gMap.setCenter(oPos);

        console.log('refresh');
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
        "click .problems a": "toggleEmptyState",
        "click #refresh-me": "refreshPosition"
    },

    render: function (bUpdateMarker) {
        // Permet d'éviter une "empilation" de marqueur lors du refresh de position
        if (bUpdateMarker == undefined) {
            bUpdateMarker = true;
        }

        console.log('updatedAt');
        console.log(this.model.get("date"));

        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        // Création du marqueur

        if (bUpdateMarker) {
            var status = (this.model.get('empty')) ? 'empty' : 'money';

            window.app.map.markers.push(window.app.map.newMarker({
                latitude: oTerminalPosition.latitude,
                longitude: oTerminalPosition.longitude
            }, status, 'DROP', true));
        }

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
                .text( "~" + ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
                .end()
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".empty" )
                .toggle( this.model.get( "empty" ) )
                .end()
            .find( ".problem" )
                // .toggle( this.model.get( "empty" ) )
                .end()
        return this;
    },

    toggleEmptyState: function ( e ) {
        e.preventDefault();
        var that = this;
        this.model.set( "empty", false );
        this.model.save( null, {
            "url": "/api/terminals/" + this.model.get( "id" ) + "/empty",
            "success": function() {
                that.$el
                    .find( "empty" )
                        .show()
                        .end()
                    .find( ".problems" )
                        .hide();
            }
        } );
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

        window.app.map.markers.push( window.app.map.newMarker({
            latitude: this.model.get('latitude'),
            longitude: this.model.get('longitude')
        }, status) );

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
                    .text( "~" + ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" );
        return this;
    },

    showTerminal: function ( e ) {
        e.preventDefault();
        window.app.router.navigate( "terminals/details/" + this.model.get( "id" ), { trigger: true } );
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
            _tpl = $("#tpl-result").remove().text();
        }
    },

    events: {},

    setStatus: function (sStatut) {
        this.$el.find( "#status .text" ).text(sStatut);
    },

    render: function () {
        this.$el
            .attr( "class", "col1" )
            .html( _tpl );

        var $list = this.$el.find( "ul" );

        this.collection.each( function ( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );

        return this;
    }
});

},{"./terminals-list-element":9,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);
