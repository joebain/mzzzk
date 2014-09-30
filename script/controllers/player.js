var Backbone = require("backbone");

var Player = Backbone.Events.extend({
  intialize: function(options) {
    this.playerView = options.playerView;
    this.songsView = options.songsView;
  }
});

module.exports = Player;
