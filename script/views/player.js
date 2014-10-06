var Backbone = require("backbone");

var Postman = require("../postman");

var Song = require("../models/song");
var SongsView = require("./songs");

var template = require("../../templ/player.hbs");

var router = require("../router").instance();

var Util = require("../util");

var Player = Backbone.View.extend({
  className: "mk-player",

  events: {
    "click .mk-prev-button": "previous",
    "click .mk-next-button": "next",
    "click .mk-play-button": "playPause",
    "click": "toggleExpand"
  },

  initialize: function() {
    this.listenTo(Postman, "player:setSong", this.setSong);
    this.listenTo(Postman, "player:setCollection", this.setCollection);

    this.song = new Song({title: "--", artist: "--"});

    this.expanded = false;

    this.queueView = new SongsView({reduced: true});

    this.render();
  },

  render: function() {
    var song = this.song.toJSON();
    song.src = encodeURIComponent(song.src);
    var data = {
      song: song,
      count: this.collection ? this.collection.length : 0,
      expanded: this.expanded,
      prevUrl: Backbone.history
    };
    this.el.innerHTML = template(data);

    this.queueEl = this.$el.find(".mk-queue");
    this.queueView.setCollection(this.collection);
    this.queueView.render();
    this.queueEl.append(this.queueView.$el);

    this.audioEl = this.$el.find("audio.mk-song")[0];
    this.audioEl.addEventListener("ended", this.next.bind(this));
    this.playButtonEl = this.$el.find(".mk-play-button");

    this.titleEl = this.$el.find(".mk-song-title");
    this.artistEl = this.$el.find(".mk-song-artist");
    this.topRowEl = this.$el.find(".mk-player-row-top");

    if (this.expanded) {
        this.$el.addClass("mk-expanded");
    } else {
        this.$el.removeClass("mk-expanded");
    }

    if (this.topRowEl.width() > this.$el.width()) {
        this.topRowEl.addClass("mk-animate");
    }
  },

  toggleExpand: function() {
      if (this.expanded) {
          if (this.prevUrl) {
              router.navigate(this.prevUrl);
              this.prevUrl = undefined;
          } else {
              router.navigate("/", {trigger: true});
          }
          this.slideIn();
      } else {
          this.prevUrl = window.location.pathname;
          router.navigate("/queue");
          this.slideOut();
      }
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
    if (!this.audioEl.src) return false;
    if (this.audioEl.paused) {
      this.play();
    } else {
      this.pause();
    }
    return false;
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
    return false;
  },

  previous: function() {
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
    return false;
  },

  slideOut: function() {
      this.expanded = true;
      this.$el.addClass("mk-expanded");
  },

  slideIn: function() {
      this.expanded = false;
      this.$el.removeClass("mk-expanded");
  }
});

module.exports = Player;
