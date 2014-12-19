var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("underscore");

var Router = Backbone.Router.extend({
    routes: {
        "": "artist",
        "recent": "recent",
        "queue": "queue",
        "setting": "setting",
        "song": "songs",
        "album": "album",
        "album/:name": "album",
        "artist": "artist",
        "artist/:name": "artist",
        "playlist": "playlist",
        "playlist/:name": "playlist"
    },

    initialize: function() {
        // grab the click events from links and use the router instead
        $(document).delegate("a", "click", function(evt) {
            var href = $(this).attr("href");
            var protocol = this.protocol + "//";

            var fragment = href.replace(new RegExp("^"+Backbone.history.root), "");
            fragment = Backbone.history.getFragment(fragment);

            if (_.any(Backbone.history.handlers, function(handler) {
                return handler.route.test(fragment);
            })) {
                evt.preventDefault();
                Backbone.history.navigate(fragment, true);
            }
        });

        Backbone.history.on("route", function(router, route) {
            console.log("route: " + route);
        });
    }
});

Router.instance = function() {
    if (!Router._instance) {
        Router._instance = new Router;
    }
    return Router._instance;
};

module.exports = Router;
