var Backbone = require("backbone");

var Setting = Backbone.Model.extend({
    url: "/setting"
});

module.exports = Setting;
