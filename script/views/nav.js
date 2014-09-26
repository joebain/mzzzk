var Backbone = require("backbone");

var template = require("../../templ/nav.hbs");

var NavView = Backbone.View.extend({
    className: "mk-nav",

    initialize: function() {
        this.render();
    },

    render: function() {
        this.el.innerHTML = template();
    }
});

module.exports = NavView;
