var FileMonitor = require("../file-monitor.js");
var env = require("../env.json");

var fm = new FileMonitor(env.music_dir);

module.exports = {
	scan: function *(next) {
        if (fm.scanning) {
            this.data = {status: "scanning", count: fm.scanCount};
        } else {
            try {
                yield fm.scan();
                this.data = {status: "Success"};
            } catch (e) {
                fm.stop();
                this.data = {error: "Error scanning", detail: e};
            }
        }
        yield next;
	}
};
