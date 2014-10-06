var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var router = require("../router").instance();

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
    el: "body",

	initialize: function(options) {
        this.songsView = options.songsView;
        this.albumsView = options.albumsView;
        this.artistsView = options.artistsView;
        this.navView = options.navView;

        this.detailSongsView = options.detailSongsView;
        this.detailSongs = options.detailSongs;

        this.playerView = options.playerView;

        this.currentListView = this.albumsView;

        this.settingView = options.settingView;

        this.listenTo(router, "route", this.onRoute);

        this.pageMap = {
            "songs": this.songsView,
            "artist": this.artistsView,
            "album": this.albumsView,
            "setting": this.settingView
        };
	},

    onRoute: function(page, args) {
        var item = args && args[0];
        var view;
        if (item) {
            view = this.detailSongsView;
        } else {
            view = this.pageMap[page];
        }
        if (view) {
            this.currentListView = view;

            if (item) {
                this.detailSongs.reset();
                this.detailSongs.fetch({key: page, value: item});
            }
            view.render();
            this.render();
        }
        if (page === "queue") {
            this.playerView.slideOut();
        } else {
            this.playerView.slideIn();
        }

    },

	render: function() {
        if (this.el.innerHTML.trim().length === 0) {
            this.el.innerHTML = template();
        }

        if (!this.contentEl) {
            this.contentEl = this.$el.find(".mk-app-content");
        } else {
            this.contentEl.empty();
        }
        this.contentEl.append(this.currentListView.$el);

        if (!this.navEl) {
            this.navEl = this.$el.find(".mk-app-nav");
            this.navEl.append(this.navView.$el);
        }

        if (!this.playerEl) {
            this.playerEl = this.$el.find(".mk-app-player");
            this.playerEl.append(this.playerView.$el);
        }
	}
});

module.exports = AppView;
