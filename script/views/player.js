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
    this.listenTo(Postman, "player:setCollection", this.setCollection);

    this.song = new Song({title: "--", artist: "--"});

    this.render();
  },

  render: function() {
    var data = {
      song: this.song.toJSON(),
      count: this.collection ? this.collection.length : 0
    };
    this.el.innerHTML = template(data);

    this.audioEl = this.$el.find("audio.mk-song")[0];
    this.audioEl.addEventListener("ended", this.next.bind(this));
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

  setCollection: function(collection) {
    this.collection = collection;
    this.song = collection.at(0);
    this.render();
  },

  play: function() {
    if (!this.audioEl.src) return;
    this.audioEl.play();
    this.playButtonEl.text("Pause");
  },

  pause: function() {
    this.audioEl.pause();
    this.playButtonEl.text("Play");
  },

  playPause: function() {
    if (!this.audioEl.src) return;
    if (this.audioEl.paused) {
      this.play();
    } else {
      this.pause();
    }
  },

  next: function() {
    if (this.collection) {
      var i = this.collection.indexOf(this.song);
      if (i < this.collection.length) {
        this.song = this.collection.at(i+1);
        this.render();
        this.play();
      } else {
        this.pause();
      }
    }
  },

  prev: function() {
    if (this.collection) {
      var i = this.collection.indexOf(this.song);
      if (i > 0) {
        this.song = this.collection.at(i-1);
        this.render();
        this.play();
      } else {
        this.pause();
      }
    }
  }
});

module.exports = Player;
