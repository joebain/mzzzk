var Backbone = require("backbone");
var Song = require("./song");

var Songs = Backbone.Collection.extend({
    model: Song,

    url: "//localhost:5984/mzzzk/_design/songs/_view/by-artist?include_docs=true",

    parse: function(resp, options) {
        return resp.rows;
    }
});

module.exports = Songs;
