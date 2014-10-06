var Backbone = require("backbone");

var Postman = require("../postman");

var template = require("../../templ/song.hbs");

var SongView = Backbone.View.extend({
    className: "mk-song",

    events: {
        "click .mk-song-edit-toggle": "toggleEditMode",
        "click .mk-song-save": "save",
        "click .mk-song-delete": "delete",
        "click": "playSong"
    },

    initialize: function(options) {
        this.listenTo(this.model, "sync", this.render);

        this.editMode = false;
        this.reduced = !!options.reduced;
    },

    render: function() {
        var data = this.model.toJSON();
        data.editMode = this.editMode;
        data.reduced = this.reduced;
        this.el.innerHTML = template(data);
    },

    playSong: function() {
      Postman.trigger("player:setCollection", this.model.collection);
      Postman.trigger("player:setSong", this.model);
      return false;
    },

    toggleEditMode: function(e) {
        this.editMode = !this.editMode;
        this.render();

        return false;
    },

    save: function(e) {
        if (this.editMode) {
            this.model.save({
                title: this.$el.find(".mk-song-title").html(),
                artist: this.$el.find(".mk-song-artist").html(),
                track: this.$el.find(".mk-song-track").html(),
                album: this.$el.find(".mk-song-album").html()
            });
            this.editMode = false;
            this.render();
        }

        return false;
    },

    delete: function(e) {
        this.model.destroy();
        this.$el.remove();

        return false;
    }
});

module.exports = SongView;
