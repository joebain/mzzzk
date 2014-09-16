var koa = require("koa");
var serve = require("koa-static");
var router = require("koa-router");
var fs = require("fs");
var _ = require("lodash");

var env = require("./env.json");

var songRoutes = require("./routes/songs");
var scannerRoutes = require("./routes/scanner");

var app = koa();

app.use(router(app));

app.get("/songs", songRoutes.getSongs);
app.get("/songs/:id", songRoutes.getSong);
app.get("/scan", scannerRoutes.scan);

var readFile = function(path, encoding) {
	return function(fn) {
		fs.readFile(path, encoding, fn);
	}
}

app.use(function *(next) {
	if (this.data /* i.e. if we matched a route */) {
		if (this.header.accept.match(/application\/json/)) {
			this.body = this.data;
			this.type = 'application/json';
		} else { // assume this is a html request
			var filePath = env.root+"/index.html";
			var index = yield readFile(filePath, 'utf-8');
			this.body = _.template(index, {data: JSON.stringify(this.data)});
			this.type = 'text/html';
		}
	} else {
		yield next;
	}
});

app.use(serve(env.root));

app.listen(3000);

