var Backbone = require("backbone");
require("couchback");

var Song = require("./song");

var Songs = Backbone.Couch.Collection.extend({
    model: Song,

    couch_host: "localhost:5984",
    couch_name: "mzzzk",
    couch_design: "songs",
    couch_view: "by-album"
});

module.exports = Songs;
