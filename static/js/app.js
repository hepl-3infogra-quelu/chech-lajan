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
    jeolok      = require( "jeolok" ),
    Router      = require( "./router" );

window.app.now = new Date();

$( function() {
    FastClick( document.body );

    console.log( window.app );
    console.log( "ready." );

    window.app.router = new Router();
    window.app.router.start();

} );

},{"./router":4,"fastclick":"fastclick","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
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

BackBone.$    = require( "jquery" );

module.exports = BackBone.Model.extend( {

    urlRoot: "api/terminals",

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
    $             = require( "jquery" ),
    jeolok        = require( "jeolok" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var TerminalsListView = require( "./views/terminals-list" );
var TerminalDetailsView = require( "./views/terminal-details" );

var TerminalModel = require( "./models/terminal" );
var TerminalsCollection = require( "./collections/terminals" );

var oPosition;

module.exports = BackBone.Router.extend( {
    views: {

    },

    routes: {
        "terminals/list": "showTerminalsList",
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalDetails",
        "": "showTerminalsList"
    },

    start: function () {
        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );

        // 2. get geopos
        jeolok.getCurrentPosition( {"enableHighAccuracy": true}, function (oError, oGivenPosition){
            // console.log(oGivenPosition);
            if (oError) {
                console.log ("oups..");
                oPosition = {
                    latitude: 50.84274,
                    longitude: 4.35154
                }
            }
            else {
                oPosition = oGivenPosition.coords;
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
        var oTerminalsCollection = new TerminalsCollection( oPosition );
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    data: {
                        latitude: 50.84274,
                        longitude: 4.35154
                        // latitude: oPosition.latitude,
                        // longitude: oPosition.longitude
                    },
                    success: function () {
                        console.log( "collection fetch done" )
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.main.loading( false );
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
                        console.log( "Model successfully fetched" )
                        this.views.main.loading( false );
                    }
                } );
    }
} );

},{"./collections/terminals":2,"./models/terminal":3,"./views/header":5,"./views/main":6,"./views/terminal-details":7,"./views/terminals-list":9,"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
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
        // Cette méthode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find("#main div").remove();
    },

    initHeader: function ( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    initList: function ( TerminalListView ) {
        this.$el.find( "#main" ).append( TerminalListView.$el );
    },

    initDetails: function ( TerminalDetailsView ) {
        this.$el.find( "#main" ).append( TerminalDetailsView.$el );
    }
});

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
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

    el: "<div />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-details").remove().text();
        }
    },

    events: {
        "click .problems a": "toggleEmptyState"
    },

    render: function () {
        var oBank = this.model;

        this.$el
            .attr( "class", "overlay" )
            .html( _tpl )
            .find("h2")
            .css("color", "#" + oBank.color)
            .text((oBank && oBank.name) ? oBank.name : "Inconnu")
            .end()
                .find("h2 img")
                    .attr( "src", "banks/" + oBank.icon )
                    .attr( "alt", (oBank && oBank.name) ? oBank.name : "Inconnu" )
                    .end()
            .find( "span" )
                .text( ( parseFloat( this.model.distance ) * 1000 ) + "m" )
            .find( ".empty" )
                .toggle(this.model.get("empty"))
                .end()
            ;
        return this;
    },

    toggleEmptyState: function () {
        a.preventDefault();
        this.model.set( "empty", false);
        this.model.save(null, {
            success: function () {

            }
        })
    }
});

},{"backbone":"backbone","jeyo-distans":"jeyo-distans","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
/* Chèch Lajan
*
* /views/terminal-list-element.js - backbone terminals element view
*
* started @ 12/12/14
*/


"use strict";

var _             = require( "underscore" ),
    $             = require( "jquery" ),
    jeolok        = require( "jeolok" ),
    BackBone      = require( "backbone" );

BackBone.$    = require( "jquery" );

var _tpl;

module.exports = BackBone.View.extend({

    el: "<li />",

    constructor: function (oTerminalModel) {
        BackBone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalListElementView:init()" );

        if ( !_tpl ) {
            _tpl = $("#tpl-result-list-elt").remove().text();
        }
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
                    .attr( "src", "banks/" + oBank.icon )
                    .attr("alt", (oBank && oBank.name) ? oBank.name : "Inconnu")
                    .end()
                .find("strong")
                    .css("color", "#" + oBank.color)
                    .text((oBank && oBank.name) ? oBank.name : "Inconnu")
                    .end()
                .find("span")
                    .text( ( parseFloat( this.model.distance ) * 1000 ) + "m" );
        return this;
    },

    showTerminal: function (e) {
        e.preventDefault();
        window.app.router.navigate( "terminals/details/" + this.model.get( "id" ), {trigger: true} );
    }
});

},{"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
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

    constructor: function (oTerminalsCollection) {
        BackBone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "TerminalListView:init()" );

        if (!_tpl) {
            _tpl = $("#tpl-result").remove().text();
        }
    },

    events: {},
    render: function () {
        this.$el
            .attr( "class", "overlay" )
            .html( _tpl );

        var list = this.$el.find( "ul" );
        console.log ("list");
        this.collection.each( function ( oTerminalModel ) {
            list.append( ( new TerminalElementView( oTerminalModel ) ).render().$el );
        } );

        return this;
    }
});

},{"./terminals-list-element":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);
