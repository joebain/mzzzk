var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var AppView = require("./views/app");
var SongsView = require("./views/songs");
var NavView = require("./views/nav");

var Songs = require("./models/songs");
var SongBlocks = require("./models/song-blocks");

var SongBlocksView = require("./views/song-blocks");

var Router = require("./router");

var PlayerView = require("./views/player");

$(function() {
    var songs = new Songs();
    var songsView = new SongsView({collection: songs});

    var albums = new SongBlocks([], {couch_view: "album", sub_attr: "artists"});
    var artists = new SongBlocks([], {couch_view: "artist", sub_attr: "albums"});

    var albumsView = new SongBlocksView({blocks: albums});
    var artistsView = new SongBlocksView({blocks: artists});

    var detailSongs = new Songs();
    var detailSongsView = new SongsView({collection: detailSongs});

    var navView = new NavView();

    var router = new Router();

    var playerView = new PlayerView();

    var queueView = new SongsView;


	var appView = new AppView({
        router: router,
        navView: navView,
        songsView: songsView,
        artistsView: artistsView,
        albumsView: albumsView,
        playerView: playerView,
        detailSongsView: detailSongsView,
        detailSongs: detailSongs,
        queueView: queueView
    });
	appView.render();

    songs.fetch();
    albums.fetch();
    artists.fetch();

    Backbone.history.start({pushState: true, root: "/"});
    router.trigger("route", Backbone.history.fragment);
});
