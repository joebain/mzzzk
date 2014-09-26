var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
    el: "body",

	initialize: function(options) {
        this.songsView = options.songsView;
        this.navView = options.navView;
	},

	render: function() {
		this.el.innerHTML = template();

        this.contentEl = this.$el.find(".mk-app-content");
        this.contentEl.append(this.songsView.$el);

        this.navEl = this.$el.find(".mk-app-nav");
        this.navEl.append(this.navView.$el);
	}
});

module.exports = AppView;
