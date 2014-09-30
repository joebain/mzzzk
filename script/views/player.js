var Backbone = require("backbone");

var Postman = require("../postman");

var Song = require("../models/song");

var template = require("../../templ/player.hbs");

var Player = Backbone.View.extend({
  className: "mk-player",

  events: {
    "click .mk-prev-button": "previous",
    "click .mk-next-button": "next",
    "click .mk-play-button": "playPause"
  },

  initialize: function() {
    this.listenTo(Postman, "player:setSong", this.setSong);

    this.song = new Song({title: "--", artist: "--"});

    this.render();
  },

  render: function() {
    this.el.innerHTML = template(this.song.toJSON());

    this.audioEl = this.$el.find("audio.mk-song")[0];
    this.playButtonEl = this.$el.find(".mk-play-button");

    this.titleEl = this.$el.find(".mk-song-title");
    this.artistEl = this.$el.find(".mk-song-artist");
  },

  setSong: function(song) {
    this.song = song;
    this.render();
    if (this.audioEl.paused) {
      this.playPause();
    }
  },

  playPause: function() {
    if (!this.audioEl.src) return;
    if (this.audioEl.paused) {
      this.audioEl.play();
      this.playButtonEl.text("Pause");
    } else {
      this.audioEl.pause();
      this.playButtonEl.text("Play");
    }
  },

  next: function() {
  },

  prev: function() {
  }
});

module.exports = Player;
