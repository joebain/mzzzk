//var mongo = require("mongodb");
//var co = require('co');
//var comongo = require('co-mongo');

//var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
//module.exports = new mongo.Db('mzzzk', server, {w: 1});

module.exports = {
	url: 'mongodb://127.0.0.1:27017/mzzzk'
};

//module.exports = co(function *() {
//  yield comongo.connect(url);
//})();

