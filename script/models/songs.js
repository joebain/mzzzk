var Backbone = require("backbone");
require("couchback");

var Postman = require("../postman");

var Song = require("./song");

var Songs = Backbone.Couch.Collection.extend({
    model: Song,

    couch_host: "localhost:5984",
    couch_name: "mzzzk",
    couch_design: "songs",
    couch_view: "by-album",

    initialize: function() {
        this.listenTo(Postman, "scanner:complete", this.fetch);
    }
});

module.exports = Songs;
