var koa = require("koa");
var serve = require("koa-static");
var router = require("koa-router");
var fs = require("fs");
var _ = require("lodash");

var env = require("./env.json");

var scannerRoutes = require("./routes/scanner");
var appRoutes = require("./routes/app");

var app = koa();

app.use(router(app));

app.get("/scan", scannerRoutes.scan);

app.get("/", appRoutes.home);
app.get("/artist", appRoutes.home);
app.get("/artist/:artist", appRoutes.home);
app.get("/album", appRoutes.home);
app.get("/album/:album", appRoutes.home);
app.get("/songs", appRoutes.home);
app.get("/queue", appRoutes.home);
app.get("/recent", appRoutes.home);
app.get("/playlist", appRoutes.home);
app.get("/playlist/:playlist", appRoutes.home);
app.get("/settings", appRoutes.home);

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
			this.body = _.template(index, {data: (JSON.stringify(this.data) || "")});
			this.type = 'text/html';
		}
	} else {
		yield next;
	}
});

app.use(serve(env.root));
app.use(serve(env.music_dir));

app.use(function *(next) {
    this.status = 404;
    this.body = "Not found.";
});

app.listen(3000);

