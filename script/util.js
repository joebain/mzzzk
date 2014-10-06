Util = {};

Util.strToUniformInt = function(s) {
  var c = 0;
  var n = 10;
  var lim = s.length < n ? s.length : n;
  for (var i = 0 ; i < lim ; i++) {
    c += Util.charToUniformInt(s.charAt(i)) * i;
  }
  return c % 1.0;
}
Util.charToUniformInt = function(c) {
  return (Math.abs(c.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)) % 26) / 26;
}
Util.getFontSizeToFit = function(str, w) {
  measuringContext.font = "100px Ubuntu";
  var t = measuringContext.measureText(str).width;
  return (w/t) * 100;
}
Util.getTextWidth = function(str, size) {
    measuringContext.font = size + "px Ubuntu";
    var t = measuringContext.measureText(str).width;
}
var textWidthCache = {};
var measuringContext;
(function() {
  var canvas = document.createElement("canvas");
  measuringContext = canvas.getContext("2d");
})();

module.exports = Util;
