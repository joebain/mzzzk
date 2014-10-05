var Backbone = require("backbone");
var $ = require("jquery");

var Postman = require("../postman");

var template = require("../../templ/scanner.hbs");

var ScannerView = Backbone.View.extend({
    className: "mk-scanner",

    events: {
        "click .mk-button": "buttonPressed"
    },

    initialize: function() {
    },

    render: function() {
        if (this.el.innerHTML === "") {
            this.firstTime = true;
            this.el.innerHTML = template();
        } else {
            this.firstTime = false;
        }

        this.scanButton = this.$el.find(".mk-button");
        this.messageEl = this.$el.find(".mk-message");

        if (this.firstTime) {
            this.startUpdateScan(true);
        } else {
            this.delegateEvents();
        }
    },

    buttonPressed: function() {
        if (this.updateInterval) {
            this.cancel();
        } else {
            this.scan();
        }
    },

    scan: function() {
        $.ajax("/scan/start", {
            type: "POST",
            dataType: "json",
            context: this,
            success: function(resp) {
                if (resp && resp.status) {
                    if (resp.status == "success") {
                        this.messageEl.text("Scan complete.");
                        Postman.trigger("scanner:complete");
                        this.stopUpdateScan();
                    } else if (resp.status === "error") {
                        this.messageEl.text("Error scanning: " + e.error);
                        this.stopUpdateScan();
                    }
                } else {
                    this.messageEl.text("Error scanning");
                    this.stopUpdateScan();
                }
            },
            error: function(e) {
                this.messageEl.text("Error scanning: " + e.error);
                this.stopUpdateScan();
            }
        });
        this.messageEl.text("Scan initialited.");
        this.startUpdateScan();
    },

    updateScan: function(hideErrors) {
        $.ajax("/scan/status", {
            type: "GET",
            dataType: "json",
            context: this,
            success: function(resp) {
                if (resp && resp.status) {
                    if (resp.status === "scanning") {
                        if (!hideErrors) {
                            this.messageEl.text("Scanned " + resp.count  + " files.");
                        }
                    } else if (resp.status === "error") {
                        if (!hideErrors) {
                            this.messageEl.text("Error scanning: " + e.error);
                        }
                        this.stopUpdateScan();
                    } else if (resp.status === "idle") {
                        this.stopUpdateScan();
                        this.messageEl.text("");
                    }
                } else {
                    if (!hideErrors) {
                        this.messageEl.text("Error scanning");
                    }
                    this.stopUpdateScan();
                }
            },
            error: function(e) {
                if (!hideErrors) {
                    this.messageEl.text("Error scanning: " + e.error);
                }
                this.stopUpdateScan();
            }
        });
    },

    startUpdateScan: function(hideErrors) {
        if (!this.updateInterval) {
            this.scanButton.text("Cancel scan");
            this.updateInterval = setInterval(this.updateScan.bind(this, hideErrors), 500);
        }
    },

    stopUpdateScan: function() {
        this.scanButton.text("Start Scan");
        clearInterval(this.updateInterval);
        this.updateInterval = undefined;
    },

    cancel: function() {
        $.ajax("/scan/stop", {
            type: "GET",
            dataType: "json",
            context: this,
            success: function(resp) {
                if (resp && resp.status) {
                    if (resp.status === "cancelled") {
                        this.messageEl.text("Cancelled scan");
                        this.stopUpdateScan();
                    }
                }
            }
        });
    }
});

module.exports = ScannerView;
