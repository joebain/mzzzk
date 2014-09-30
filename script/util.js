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
  var t = measuringContext.measureText(str).width;
  return (w/t) * 100;
}
var textWidthCache = {};
var measuringContext;
(function() {
  var canvas = document.createElement("canvas");
  measuringContext = canvas.getContext("2d");
  measuringContext.font = "100px Ubuntu";
})();

module.exports = Util;
