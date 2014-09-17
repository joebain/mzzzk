var Backbone = require("backbone");
var Song = require("./song");
var CouchCollection = require("./couch-collection");

var Songs = CouchCollection.extend({
    model: Song,

    couch_host: "localhost:5984",
    couch_name: "mzzzk",
    couch_design: "songs",
    couch_view: "by-album"
});

module.exports = Songs;
