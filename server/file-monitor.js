var _ = require("lodash");
var fs = require("fs");
var thunkify = require("thunkify");
var path = require("path");

var taglib = require("taglib");

var couch = require("./db");
var env = require("./env.json");


var FileMonitor = function(rootPath) {
	this.root = rootPath;
	this.root[this.root.length-1] === "/" || (this.root += "/");
};

_.extend(FileMonitor.prototype, {
	scan: function *(dir) {
		dir = dir || this.root;
		if (dir === this.root) { 
			if (this.scanning) {
				throw "Already scanning.";
			} else {
				this.scanning = true;
                this.scanCount = 0;
			}
		} else {
            if (!this.scanning) {
                return;
            }
        }
		dir[dir.length-1] === "/" || (dir += "/");
		var files = yield thunkify(fs.readdir)(dir);
		for (var f = 0 ; f < files.length ; f++) {
			var fileName = files[f];
			var filePath = dir + fileName;
			var stats = yield thunkify(fs.stat)(filePath);
			if (stats.isDirectory()) {
				yield this.scan(filePath);
			} else if (stats.isFile()) {
				console.log(fileName);
				if (fileName.match(/\.(?:mp3|ogg|wma|wav|m4a|oga|aac)$/)) {
                    if (!this.scanning) {
                        return;
                    }
                    this.scanCount++;
                    var stat = yield thunkify(fs.stat)(filePath);
					var tag = yield thunkify(taglib.tag)(filePath);
                    tag || (tag = {});
                    tag.type = "song";
                    tag.title || (tag.title = path.basename(fileName, path.extname(fileName)));
                    tag.album || (tag.album = path.basename(path.dirname(filePath)));
                    tag.src = path.relative(this.root, filePath);
                    tag.size = stat.size;
                    tag.filehash = tag.size + " - " + tag.src;
                    tag.taghash = tag.artist + " - " + tag.album + " - " + tag.track + " - " + tag.title;

                    var songs = yield couch.rawGet.bind(couch, env.db.name, "_design/songs/_view/by-filehash", {key: tag.filehash, include_docs: true});
                    if (!songs || songs.data.rows.length === 0 || !songs.data.rows[0].doc) {
                        console.log("inserting song");
                        tag._id = (yield couch.uniqid.bind(couch, 1))[0];
                        yield couch.insert.bind(couch, env.db.name, tag);
                        console.log("inserted song");
                    } else {
                        console.log("song already in db");
                        songData = songs.data.rows[0].doc;
                        if (tag.taghash !== songData.taghash || tag.filehash !== songData.filehash) {
                            console.log("hashes have changed, updating");
                            tag._id = songData._id;
                            tag._rev = songData._rev;
                            yield couch.update.bind(couch, env.db.name, tag);
                        }
                    }
				}
			}
		}
		if (dir === this.root) { 
            console.log("finished scan");
			this.scanning = false;
		}
	},

    stop: function() {
        this.scanning = false;
    }
});

module.exports = FileMonitor;
