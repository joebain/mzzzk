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

        this.playerView = options.playerView;

        this.currentListView = this.albumsView;

        this.listenTo(this.router, "route", this.onRoute);

        this.pageMap = {
            "songs": this.songsView,
            "artists": this.artistsView,
            "albums": this.albumsView
        };
	},

    onRoute: function(url) {
        var slashI = url.indexOf("/");
        var page = slashI > 0 ? url.substr(0, slashI) : url;
        var view = this.pageMap[page];
        if (view) {
            this.currentListView = view;
            view.render();
            this.render();
        }
    },

	render: function() {
		this.el.innerHTML = template();

        this.contentEl = this.$el.find(".mk-app-content");
        this.contentEl.append(this.currentListView.$el);

        this.navEl = this.$el.find(".mk-app-nav");
        this.navEl.append(this.navView.$el);

        this.playerEl = this.$el.find(".mk-app-player");
        this.playerEl.append(this.playerView.$el);
	}
});

module.exports = AppView;
