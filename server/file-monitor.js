var _ = require("lodash");
var fs = require("fs");
var thunkify = require("thunkify");

var db = require("./db");
var comongo = require('co-mongo');
var taglib = require("taglib");


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
					var con = yield comongo.connect(db.url);
					var tag = yield thunkify(taglib.tag)(filePath);
					console.log("got metadata");
					console.log(tag);
					if (tag && tag.artist && tag.title) {
						var songs = yield con.collection("songs");
						console.log("inserting song");
						var song = yield songs.findOne(tag);
						if (!song) {
							yield songs.insert(tag);
						}
						var albums = yield con.collection("albums");
						var album = yield albums.findOne({title: tag.album});
						if (!album) {
							yield albums.insert({
								title: tag.album,
								artist: tag.artist,
								year: tag.year
							});
						}
						var artists = yield con.collection("artists");
						var artist = yield artists.findOne({name: tag.artist});
						if (!artist) {
							yield artists.insert({
								name: tag.artist
							});
						}
					}
					yield con.close();
				}
			}
		}
		if (dir === this.root) { 
			this.scanning = false;
		}
	}
});

module.exports = FileMonitor;
