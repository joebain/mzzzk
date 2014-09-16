var FileMonitor = require("../file-monitor.js");

var fm = new FileMonitor("/home/joe/Music");

module.exports = {
	scan: function *(next) {
        if (fm.scanning) {
            this.data = {status: "scanning", count: fm.scanCount};
        } else {
            try {
                yield fm.scan();
                this.data = {status: "Sucess"};
            } catch (e) {
                fm.stop();
                this.data = {error: "Error scanning", detail: e};
            }
        }
        yield next;
	}
};
