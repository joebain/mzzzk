var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var router = require("../router").instance();

var template = require("../../templ/app.hbs");

var AppView = Backbone.View.extend({
    el: "body",

    events: {
        "touchstart": "touchStart",
        "touchend": "touchEnd",
        "touchmove": "touchMove"
    },

	initialize: function(options) {
        this.songsView = options.songsView;
        this.albumsView = options.albumsView;
        this.artistsView = options.artistsView;
        this.navView = options.navView;

        this.detailSongsView = options.detailSongsView;
        this.detailSongs = options.detailSongs;

        this.playerView = options.playerView;

        this.currentListView = this.albumsView;

        this.settingView = options.settingView;

        this.listenTo(router, "route", this.onRoute);

        this.pageMap = {
            "songs": this.songsView,
            "artist": this.artistsView,
            "album": this.albumsView,
            "setting": this.settingView,
            "": this.navView
        };

        this.lastTouches = [];
        this.lastTouchesLength = 5;
	},

    onRoute: function(page, args) {
        var item = args && args[0];
        if (page === this.lastPage && item == this.lastItem) {
            return;
        }

        this.parentRoute = undefined;
        if (page && item) {
            this.parentRoute = "/" + page;
        }

        this.currentView = undefined;
        if (item) {
            this.currentView = this.detailSongsView;
            // and fetch the appropriate collection
            this.detailSongs.reset();
            this.detailSongs.fetch({key: page, value: item});
        } else if (page) {
            this.currentView = this.pageMap[page];
        } else {
            this.currentView = this.navView;
        }
        this.parentView = undefined;
        if (item) {
            this.parentView = this.pageMap[page];
        } else if (page) {
            this.parentView = this.navView;
        }

        this.parentView.render();
        this.currentView.render();

        this.render();
        
        /*
        this.lastPage = page;
        this.lastItem = item;
        var view;
        if (item) {
            view = this.detailSongsView;
        } else {
            view = this.pageMap[page];
        }
        if (view) {
            this.currentListView = view;

            if (item) {
                this.detailSongs.reset();
                this.detailSongs.fetch({key: page, value: item});
            }
            if (item && this.contentEl1.empty()) {
                this.renderPageUp();
            }
            view.render();
            this.render();
        }
        if (page === "queue") {
            this.playerView.slideOut();
        } else {
            this.playerView.slideIn();
        }
        */
    },

	render: function() {
        if (this.el.innerHTML.trim().length === 0) {
            this.el.innerHTML = template({mobile: Util.isMobile()});
        }

        if (!this.contentEl) {
            this.contentEl = this.$el.find(".mk-app-content-current");
            this.parentContentEl = this.$el.find(".mk-app-content-parent");
        }/* else {
            var tmpContentEl = this.contentEl2;
            this.contentEl2 = this.contentEl1;
            this.contentEl1 = tmpContentEl;
            this.contentEl1.empty();
        }*/
        else {
            this.parentContentEl.empty();
            this.contentEl.empty();
            this.contentEl.css("transform", "translateX(0px)");   
        }

        if (this.currentView) {
            this.contentEl.append(this.currentView.$el);
        }

        if (Util.isMobile() && this.parentView) {
            this.parentContentEl.append(this.parentView.$el);
        }

        if (!this.navEl && !Util.isMobile()) {
            this.navEl = this.$el.find(".mk-app-nav");
            this.navEl.append(this.navView.$el);
        }

        if (!this.playerEl) {
            this.playerEl = this.$el.find(".mk-app-player");
            this.playerEl.append(this.playerView.$el);
        }
	},

    touchStart: function(e) {
        var oe = e.originalEvent;
        if (!this.touchid) {
            this.touchid = oe.touches[0].identifier;
            this.touchx = oe.touches[0].pageX;
            this.touchy = oe.touches[0].pageY;
            this.toucht = Date.now();

//            return false;
        }
//        return true;
    },

    touchEnd: function(e) {
        var oe = e.originalEvent;
        for (var t = 0 ; t < oe.changedTouches.length ; t++) {
            if (oe.changedTouches[t].identifier === this.touchid) {
                this.touchid = undefined;

                this.vx = 0;
                this.vy = 0;
                for (var i = 0 ; i < this.lastTouches.length ; i++) {
                    this.vx += this.lastTouches[i].dx / this.lastTouches[i].dt;
                    this.vy += this.lastTouches[i].dy / this.lastTouches[i].dt;
                }
                this.dx = this.touchx - oe.changedTouches[t].pageX;
                this.dy = this.touchy - oe.changedTouches[t].pageY;
                this.vx *= -1;
                this.vy *= -1;
                this.vx /= this.lastTouches.length;
                this.vy /= this.lastTouches.length;
                this.last_t = Date.now();
                if (this.last_t - this.toucht > 300) {
                    requestAnimationFrame(this.animatePage.bind(this));
                } else {
                    this.contentEl.css("transform", "translateX(0px)");   
                }
                return;
            }
        }
    },


    touchMove: function(e) {
        var oe = e.originalEvent;
        for (var t = 0 ; t < oe.touches.length ; t++) {
            if (oe.touches[t].identifier === this.touchid) {
                var x = oe.touches[t].pageX;
                var y = oe.touches[t].pageY;
                var time = Date.now();
                var lastTouch = this.lastTouches.length > 0 ? this.lastTouches[this.lastTouches.length-1] : {x:x, y: y, t: time};
                this.lastTouches.push({
                    x: x,
                    y: y,
                    t: time,
                    dx: x - lastTouch.x,
                    dy: y - lastTouch.y,
                    dt: time - lastTouch.t
                });
                if (this.lastTouches.length > this.lastTouchesLength) {
                    this.lastTouches.shift();
                }

                var dx = this.touchx - oe.touches[t].pageX;
                var dy = this.touchy - oe.touches[t].pageY;

                if (dx < -20 && this.parentView) {
                    this.contentEl.css("transform", "translateX(" + -dx + "px)");
                    return false;
                } else {
                    return;
                }
            }
        }
    },

    animatePage: function() {
        var t = Date.now();
        var dt = t - this.last_t;
        this.last_t = t;

        // accelerate to wherever we are going
        this.vx *= 1.05;
        this.vy *= 1.05;
        var max_v = 100;
        if (Math.abs(this.vx) > max_v) {
            this.vx = (Math.abs(this.vx)/this.vx) * max_v;
        }
        if (Math.abs(this.vy) > max_v) {
            this.vy = (Math.abs(this.vy)/this.vy) * max_v;
        }

        this.dx += this.vx * dt;
        this.dy += this.vy * dt;

        this.contentEl.css("transform", "translateX(" + -this.dx + "px)");
        if (this.dx <= -window.innerWidth) {
            if (this.parentRoute) {
                router.navigate(this.parentRoute, {trigger: true});
            }
        } else if (this.dx >= 0) {
            this.contentEl.css("transform", "translateX(0px)");   
        } else {
            requestAnimationFrame(this.animatePage.bind(this));
        }
    },
});

module.exports = AppView;
