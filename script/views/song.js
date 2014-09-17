var Backbone = require("backbone");

var template = require("../../templ/song.hbs");

var SongView = Backbone.View.extend({
    className: "mk-song",

    events: {
        "click .mk-song-edit-toggle": "toggleEditMode",
        "click .mk-song-save": "save",
        "click .mk-song-delete": "delete"
    },

    initialize: function() {
        this.listenTo(this.model, "sync", this.render);

        this.editMode = false;
    },

    render: function() {
        var data = this.model.toJSON();
        data.editMode = this.editMode;
        this.el.innerHTML = template(data);
    },

    toggleEditMode: function() {
        this.editMode = !this.editMode;
        this.render();
    },

    save: function() {
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
    },

    delete: function() {
        this.model.destroy();
        this.$el.remove();
    }
});

module.exports = SongView;
