var Backbone = require("backbone");

var template = require("../../templ/song-block.hbs");

var util = require("../util");

var SongBlock = Backbone.View.extend({
    tagName: "a",
    className: "mk-song-block",

    initialize: function(options) {
        this.block = options.block;

        this.$el.attr("href", this.block.collection.couch_view + "/" + this.block.id);
        this.sub_attr = this.block.collection.sub_attr;
    },

    render: function() {
        var data = {
            title: this.block.id,
            count: this.block.get("count")
        };
        if (this.block.has("values")) {
            var sub = this.block.get("values");
            if (sub.length > 1 && sub instanceof Array) {
                data["sub-title"] = sub.length + " " + this.sub_attr.charAt(0).toUpperCase() + this.sub_attr.substr(1);
            } else {
                data["sub-title"] = sub[0];
            }
        }
        this.el.innerHTML = template(data);

        var titleEl = this.$el.find(".mk-block-title");

        var hue = Math.floor(Util.strToUniformInt(data.title) * 360);
        
        this.$el.css("background-color", "hsl("+hue+", 40%, 50%)");
        this.$el.css("color", "hsl("+((hue+120)%360)+", 70%, 80%)");

        var size = Util.getFontSizeToFit(data.title, 200);
        while (size > 100) {
            size /= 2;
        }

        // try to fit in a nicer way
        if (size < 40) {
            titleEl.empty();

            var words = data.title.split(" ");
            var merged_words = [];
            var mw = 0;
            merged_words[0] = "";
            for (var w = 0 ; w < words.length ; w++) {
                merged_words[mw] += " " + words[w];
                if (merged_words[mw].length > 6) {
                    merged_words[++mw] = "";
                }
            }
            for (var mw = 0 ; mw < merged_words.length ; mw++) {
                var word = merged_words[mw].trim();
                var size = Util.getFontSizeToFit(word, 200);
                if (size === Infinity) {
                    size = 80;
                }
                while (size > 80) {
                    size /= 2;
                }
                var span = document.createElement("span");
                span.innerHTML = word;
                span.style.fontSize = size+"px";
                titleEl.append(span);
            }
        } else {
            titleEl.css("font-size", size+"px");
        }
    }
});

module.exports = SongBlock;
