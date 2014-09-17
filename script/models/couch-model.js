var Backbone = require("backbone");

var CouchModel = Backbone.Model.extend({
    idAttribute: "_id",

    parse: function(resp, options) {
        return resp.doc;
    },

    url: function() {
        return "//" + this.colllection.couch_host + "/" + this.collection.couch_name + "/" + this.id;
    },

    sync: function(method, model, options) {
        options = options || {};

        if (method === "delete") {
            options.url = this.url() + "?rev=" + this.get("_rev");
        }

        var that = this;
        var oldSuccess = options.success;
        options.success = function(resp) {
            if (resp.rev) {
                that.set("_rev", resp.rev);
            }
            oldSuccess && oldSuccess.apply(this, arguments);
        }

        Backbone.sync.call(this, method, model, options);
    }
});


module.exports = CouchModel;
