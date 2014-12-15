(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Chèch Lajan
*
* /app.js - client entry point
*
* started @ 03/12/14
*/

"use strict";

var _           = require( "underscore" ),
    $           = require( "jquery" ),
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

},{"./router":4,"fastclick":"fastclick","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
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

BackBone.$    = require( "jquery" );

module.exports = BackBone.Model.extend( {

    urlRoot: "api/terminals",

    parse: function (oResponse) {
        // TODO handle errors
        if (oResponse.data && oResponse.url) {
            return oReponse.data
        }
        else {
            return oReponse
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
    $             = require( "jquery" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var TerminalsListView = require( "./views/terminals-list" );

var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: {

    },

    routes: {
        "terminals/list": "showTerminalsList",
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalsDetails",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );

        // 2. get geopos
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            console.log(oGivenPosition);
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    lattitude: 50.84274,
                    longitude: 4.35154
                }
            }
        } );

        // 3. launch router
        BackBone.history.start( {
            pushState: true
        } );
    },

    showTerminalsList: function () {
        console.log( "showTerminalsList" );

        var that = this;
        this.views.main.loading(true);
        var oTerminalsCollection = TerminalsCollection( oPosition );
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: oPosition.latitude,
                        longitude: oPosition.longitude
                    },
                    success: function () {
                        console.log( "collection fetch done" )
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.main.loading(false);
                    }
                } );
    },

    showTerminalsMap: function () {
        console.log( "showTerminalsMap" );
    },

    showTerminalsDetails: function () {
        console.log( "showTerminalsDetails" );
    }
} );

},{"./collections/terminals":2,"./views/header":5,"./views/main":6,"./views/terminals-list":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
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

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
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

    loading: function ( bLoadingState ) {
        // TODO : visual Feedback
        if (bLoadingState) {
            console.log( "Chargement..." )
        }
        else {
            console.log( "Fini !" );
        }
    },

    clearContent: function () {
        console.log("TODO: clearContent");
    },
    
    initHeader: function ( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    initList: function () {
        console.log("TODO: initList");
    }
});

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
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

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
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

    el: "<div />",

    constructor: function () {
        BackBone.View.apply( this, arguments );

        console.log( "TerminalListView:init()" );

        _tpl = $("#tpl-result").remove().text();
    },

    events: {},
    render: function () {
        this.$el
            .attr( "class", "overlay" )
            .html( _tpl );

        var list = this.$em.find( "ul" );
        this.collection.each( function ( oTerminalModel ) {
            list.append( (new TerminalElementView( oTerminalModel ) ).render().$el );
        } );

        // TODO fill list with terminals

        return this;
    }
});

},{"./terminals-list-element":7,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);
