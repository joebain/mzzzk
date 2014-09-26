var Backbone = require("backbone");

var PageSlider = Backbone.View.extend({
    tagName: "mk-page-slider",

    events: {
        "touchDown": "touchDown",
        "touchUp": "touchUp",
        "touchMove": "touchMove"
    },

    initialize: function(options) {
        this.view = options.view;
    },

    render: function() {
        this.view.render();
        this.$el.append(this.view.$el);
    },

    touchstart: function(e) {
        if (!this.touchid) {
            this.touchid = e.touches[0].identifier;
            this.touchx = e.touches[0].pageX;
            this.touchy = e.touches[0].pageY;

            e.preventDefault();
            return true;
        }
        return false;
    },

    touchend: function(e) {
        for (var t = 0 ; t < e.touches.length ; e++) {
            if (e.touches[t].identifier === this.touchid) {
                this.touchid = undefined;
                // do something?
                return true;
            }
        }
        return false;
    },

    touchmove: function(e) {
        for (var t = 0 ; t < e.touches.length ; e++) {
            if (e.touches[t].identifier === this.touchid) {
                var d = this.touchy - e.touches[t].pageY;
                if (Math.abs(d) < 20) {
                    this.$el.css("translateY", d);
                    evt.preventDefault();
                    return true;
                }
            }
        }
        return false;
    }

});

modules.export = PageSlider;
