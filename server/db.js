var env = require("./env.json");
var couchdb = require("node-couchdb");
var _ = require("lodash");

var couch = new couchdb(env.db.host, env.db.port);

var createViews = function() {
    var designName = "_design/songs";
    var views = {};
    var lists = {};
    _.each(["title", "filehash", "taghash", "album", "artist"], function(prop) {
        views["by-" + prop] = {
            map: (function(doc) {
                if (doc.type === "song" && doc["__prop"]) {
                    emit(doc["__prop"], null);
                }
            }).toString().replace(/__prop/g, prop)
        }
    });
    var sub_queries = [["artist", "album"], ["album", "artist"]];
    _.each(sub_queries, function(prop) {
        views[prop[0]] = {
            map: (function(doc) {
                if (doc.type === "song" && doc.__key) {
                    emit([doc.__key, doc.__sub], {count: 1});
                }
            }).toString().replace(/__key/g, prop[0]).replace(/__sub/g, prop[1]),
            reduce: "_count"
        }
    });
    lists["group-2"] = (function(head, req) {
      var row = getRow(), last_key = row.key[0], list = [row.key[1]], count = row.value;
      send("[");
        while (row = getRow()) {
          if (last_key != row.key[0]) {
            var toSend = {};
            toSend.key = last_key;
            toSend.values = list;
            toSend.count = count;
            send(toJSON(toSend));
            send(",\n");

            last_key = row.key[0];
            list = []
            count = 0;
          }
          list.push(row.key[1]);
          count += row.value;
        }
        var toSend = {};
        toSend.key = last_key;
        toSend.values = list;
        toSend.count = count;
        send(toJSON(toSend));
        send("]");
    }).toString();
    var doInsertViews = function() {
        couch.insert(env.db.name, {
            _id: designName,
            views: views,
            lists: lists
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
