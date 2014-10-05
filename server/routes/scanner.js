var FileMonitor = require("../file-monitor.js");
var env = require("../env.json");

var fm = new FileMonitor(env.music_dir);

module.exports = {
	start: function *(next) {
        if (fm.scanning) {
            this.data = {status: "error", error: "Already scanning"};
            this.status = 423;
        } else {
            try {
                yield fm.scan();
                this.data = {status: "success"};
            } catch (e) {
                fm.stop();
                this.data = {status: "error", error: e};
                this.status = 500;
            }
        }
        yield next;
	},

    status: function *(next) {
        if (fm.scanning) {
            this.data = {status: "scanning", count: fm.scanCount};
        } else {
            this.data = {status: "idle"};
        }
        yield next;
    },

    stop: function *(next) {
        if (fm.scanning) {
            fm.stop();
            this.data = {status: "cancelled"};
        } else {
            this.data = {status: "error", error: "Not scanning"};
            this.status = 410;
        }
        yield next;
    }
};
