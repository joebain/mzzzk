var Backbone = require("backbone");
var $ = require("jquery");

var ScannerView = require("./scanner");

var template = require("../../templ/setting.hbs");

var SettingView = Backbone.View.extend({
    className: "mk-setting",

    initialize: function() {
        this.listenTo(this.model, "sync", this.render);

        $(window).on("click", (function() {
            this.musicDirInput.removeAttr("contenteditable");
        }).bind(this));
    },

    render: function() {
        if (this.setMusicDirButton) {
            this.setMusicDirButton.off("click");
        }
        if (this.musicDirInput) {
            this.musicDirInput.off("click");
        }

        var data = this.model.toJSON();
        this.el.innerHTML = template(data);

        this.setMusicDirButton = this.$el.find(".mk-file-section .mk-button");
        this.setMusicDirButton.on("click", (function() {
            this.model.save("music_dir", this.musicDirInput.text());
        }).bind(this));
        this.musicDirInput = this.$el.find(".mk-file-section .mk-file-input");
        this.musicDirInput.on("click", (function(e) {
            this.musicDirInput.attr("contenteditable", true);
            return false;
        }).bind(this));


        this.scannerSection = this.$el.find(".mk-scanner-section");
        if (!this.scanner) {
            this.scanner = new ScannerView;
        }
        this.scannerSection.append(this.scanner.$el);
        this.scanner.render();
    }
});

module.exports = SettingView;
