var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
	initialize: function() {
	},

	render: function() {
		this.el.innerHTML = template();
	}
});

module.exports = AppView;
