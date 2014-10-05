var fs = require("fs");
var _ = require("lodash");
var thunkify = require("thunkify");

var white_list = ["music_dir"];
var settings_file = "server/env.json";

module.exports = {
    set: function *(next) {
        var oldSettings = JSON.parse(yield thunkify(fs.readFile)(settings_file));
        var newSettings = this.request.body;
        newSettings = _.pick(newSettings, white_list);
        _.defaults(newSettings, oldSettings);
        var success = yield thunkify(fs.writeFile)(settings_file, JSON.stringify(newSettings, null, "\t"));
        this.data = {status: "success"};
        yield next;
    },

    get: function *(next) {
        var settings = JSON.parse(yield thunkify(fs.readFile)(settings_file));
        settings = _.pick(settings, white_list);
        this.data = settings;
        yield next;
    }
};
