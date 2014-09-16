var FileMonitor = require("../file-monitor.js");

var fm = new FileMonitor("/home/joe/Music");

module.exports = {
	scan: function *(next) {
		yield fm.scan();
		this.data = {status: "Scan started"};
	}
};
