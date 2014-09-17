var Backbone = require("backbone");

var CouchCollection = Backbone.Collection.extend({
    url: function() {
        var url = "//" + this.couch_host + "/" + this.couch_name;
        if (this.couch_view && this.couch_design) {
            url += "/_design/" + this.couch_design + "/_view/" + this.couch_view + "?include_docs=true";
        }
        return url;
    },

    parse: function(resp, options) {
        return resp.rows;
    }
});

module.exports = CouchCollection;
