var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
    el: "body",

	initialize: function(options) {
        this.songsView = options.songsView;
	},

	render: function() {
		this.el.innerHTML = template();

        this.contentEl = this.$el.find(".mk-app-content");
        this.contentEl.append(this.songsView.$el);
	}
});

module.exports = AppView;
