var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var AppView = require("./views/app");
var SongsView = require("./views/songs");
var NavView = require("./views/nav");

var Songs = require("./models/songs");
var SongBlocks = require("./models/song-blocks");

var SongBlocksView = require("./views/song-blocks");

var Setting = require("./models/setting");
var SettingView = require("./views/setting");

var router = require("./router").instance();

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

    var setting = new Setting();
    var settingView = new SettingView({model: setting});

    var navView = new NavView();

    var playerView = new PlayerView();



	var appView = new AppView({
        navView: navView,
        songsView: songsView,
        artistsView: artistsView,
        albumsView: albumsView,
        playerView: playerView,
        detailSongsView: detailSongsView,
        detailSongs: detailSongs,
        settingView: settingView
    });
	appView.render();

    songs.fetch();
    albums.fetch();
    artists.fetch();
    setting.fetch();

    Backbone.history.start({pushState: true, root: "/"});
});
