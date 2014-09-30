var Backbone = require("backbone");

var template = require("../../templ/song-blocks.hbs");

var SongBlock = require("./song-block");

var SongBlocks = Backbone.View.extend({
    className: "mk-song-blocks",

    initialize: function(options) {
        this.blocks = options.blocks;
        this.listenTo(this.blocks, "sync", this.render);
    },

    render: function() {
        this.el.innerHTML = template();

        this.blocksEl = this.$el.find(".mk-song-blocks-list");

        this.blocks.each((function(block) {
            var blockView = new SongBlock({block: block});
            blockView.render();
            this.blocksEl.append(blockView.$el);
        }).bind(this));
    }
});

module.exports = SongBlocks;
