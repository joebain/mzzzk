var Backbone = require("backbone");

var SongView = require("./song");

var template = require("../../templ/songs.hbs");

var SongsView = Backbone.View.extend({
    className: "mk-songs",

    initialize: function(options) {
        if (this.collection) {
            this.listenTo(this.collection, "sync", this.render);
        }
    },

    setCollection: function(collection) {
        if (this.collection) {
            this.stopListening(this.collection);
        }
        this.collection = collection;
        if (this.collection) {
            this.listenTo(this.collection, "sync", this.render);
        }
    },

    render: function() {
        this.el.innerHTML = template();

        this.songListEl = this.$el.find(".mk-songs-song-list");

        if (this.collection) {
            this.collection.each((function(song) {
                var songView = new SongView({model: song});
                songView.render();
                this.songListEl.append(songView.$el);
            }).bind(this));
        }
    }
});

module.exports = SongsView;
