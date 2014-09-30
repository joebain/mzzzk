var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("underscore");

var Router = Backbone.Router.extend({
    routes: {
        "song": "songs",
        "song/:id": "song",
        "album": "albums",
        "album/:name": "album",
        "artist": "artists",
        "artist/:name": "artist"
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
    }
});

module.exports = Router;
