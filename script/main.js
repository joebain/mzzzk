var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var AppView = require("./views/app");
var SongsView = require("./views/songs");
var NavView = require("./views/nav");

var Songs = require("./models/songs");

$(function() {
    var songs = new Songs();
    var songsView = new SongsView({collection: songs});

    var navView = new NavView();

	var appView = new AppView({
        songsView: songsView,
        navView: navView
    });
	appView.render();

    songs.fetch();

	Backbone.history.start();
});
