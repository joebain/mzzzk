var env = require("./env.json");
var couchdb = require("node-couchdb");
var _ = require("lodash");

var couch = new couchdb(env.db.host, env.db.port);

var createViews = function() {
    var designName = "_design/songs";
    var views = {};
    _.each(["title", "filehash", "taghash", "album", "artist"], function(prop) {
        views["by-" + prop] = {
            map: (function(doc) {
                if (doc.type === "song" && doc["__prop"]) {
                    emit(doc["__prop"], doc);
                }
            }).toString().replace(/__prop/g, prop)
        }
    });
    _.each(["artist", "album"], function(prop) {
        views[prop] = {
            map: (function(doc) {
                if (doc.type === "song" && doc["__prop"]) {
                    emit(doc["__prop"], 1);
                }
            }).toString().replace(/__prop/g, prop),
            reduce: (function(keys, values) {
                return sum(values);
            }).toString()
        }
    });
    var doInsertViews = function() {
        couch.insert(env.db.name, {
            _id: designName,
            views: views
        }, function(err, res) {
            if (err) throw "Error inserting views: " + err;
        });
    };
    couch.rawGet(env.db.name, designName, function(err, res) {
        if (err) throw "Error getting views: " + err;

        if (res && res.data.views) {
            couch.del(env.db.name, designName, res.data._rev, function(err, res) {
                if (err) throw "Error deleting views: " + err;

                doInsertViews();
            });
        } else {
            doInsertViews();
        }
    });
}

couch.rawGet(env.db.name, "", function(err, res) {
    if (err) throw "Error getting database: " + err;

    if (res) {
        if (res.status === 200) {
            createViews();
        } else if (res.status === 404) {
            couch.createDatabase(env.db.name, function(err) {
                if (err) throw "Error creating database! " + err;

                createViews();
            });
        } else {
            throw "Error creating database! " + JSON.stringify(res);
        }
    } else {
        throw "Error creating database! No response from server.";
    }
});

module.exports = couch;
