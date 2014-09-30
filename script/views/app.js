var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
    el: "body",

	initialize: function(options) {
        this.router = options.router;

        this.songsView = options.songsView;
        this.albumsView = options.albumsView;
        this.artistsView = options.artistsView;
        this.navView = options.navView;

        this.detailSongsView = options.detailSongsView;
        this.detailSongs = options.detailSongs;

        this.playerView = options.playerView;
        this.queueView = options.queueView;

        this.currentListView = this.albumsView;

        this.listenTo(this.router, "route", this.onRoute);

        this.pageMap = {
            "songs": this.songsView,
            "artist": this.artistsView,
            "album": this.albumsView,
            "queue": this.queueView
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
            if (page === "queue") {
                this.queueView.setCollection(this.playerView.collection);
            }

            view.render();
            this.render();
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
