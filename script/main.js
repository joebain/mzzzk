var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var AppView = require("./views/app");

$(function() {
	var appView = new AppView({el: "body"});
	appView.render();

	Backbone.history.start();
});
