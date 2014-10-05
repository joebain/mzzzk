var koa = require("koa");
var serve = require("koa-static");
var router = require("koa-router");
var fs = require("fs");
var _ = require("lodash");

var bodyParser = require('koa-body-parser');

var env = require("./env.json");

var scannerRoutes = require("./routes/scanner");
var appRoutes = require("./routes/app");
var settingRoutes = require("./routes/setting");

var app = koa();

app.use(bodyParser());

app.use(router(app));

app.get("/scan", scannerRoutes.status);
app.get("/scan/status", scannerRoutes.status);
app.post("/scan/start", scannerRoutes.start);
app.post("/scan/stop", scannerRoutes.stop);

app.get("/", appRoutes.home);
app.get("/artist", appRoutes.home);
app.get("/artist/:artist", appRoutes.home);
app.get("/album", appRoutes.home);
app.get("/album/:album", appRoutes.home);
app.get("/song", appRoutes.home);
app.get("/queue", appRoutes.home);
app.get("/recent", appRoutes.home);
app.get("/playlist", appRoutes.home);
app.get("/playlist/:playlist", appRoutes.home);
app.get("/setting", settingRoutes.get);
app.post("/setting", settingRoutes.set);

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

