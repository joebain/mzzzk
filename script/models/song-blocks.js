var Backbone = require("backbone");
require("couchback");

var Postman = require("../postman");

var SongBlock = require("./song-block");

var SongBlocks = Backbone.Couch.Collection.extend({
    model: SongBlock,

    couch_host: "localhost:5984",
    couch_name: "mzzzk",
    couch_design: "songs",
    couch_list: "group-2",
    couch_group_level: 2,

    initialize: function(models, options) {
        this.couch_view = options.couch_view;
        this.sub_attr = options.sub_attr;
        this.listenTo(Postman, "scanner:complete", this.fetch);
    },

    parse: function(resp) {
        return resp;
    }
});

module.exports = SongBlocks;
