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

        this.max_v = 100;
        this.acceleration = 0.9;

        this.pageOffsetX = 0;
        this.pageOffsetY = 0;

        this.pageDragMin = 50;
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
    },

	render: function() {
        if (this.el.innerHTML.trim().length === 0) {
            this.el.innerHTML = template({mobile: Util.isMobile()});
        }

        if (!this.contentEl) {
            this.contentEl = this.$el.find(".mk-app-content-current");
            this.parentContentEl = this.$el.find(".mk-app-content-parent");
        }
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
            this.touchx = oe.touches[0].pageX - this.pageOffsetX;
            this.touchy = oe.touches[0].pageY - this.pageOffsetY;
            console.log("page offset x: " + this.pageOffsetX);
            console.log("touchx: " + this.touchx);
            this.toucht = Date.now();
        }
    },

    touchEnd: function(e) {
        var oe = e.originalEvent;
        for (var t = 0 ; t < oe.changedTouches.length ; t++) {
            if (oe.changedTouches[t].identifier === this.touchid) {
                this.touchid = undefined;

                this._recordInLastTouches(oe.changedTouches[t]);
                var vel = this._calculateVelocityOfTouch();

                this.vx = vel.x;
                this.vy = vel.y;

                this.last_t = Date.now();
                if (this.last_t - this.toucht > 300) { // prevent glancing swipes
                    requestAnimationFrame(this.animatePage.bind(this));
                } else {
                    var snapX = this.dx > -window.innerWidth*0.5 ? 0 : window.innerWidth+10;
                    this._setPagePos(snapX, 0);
                }
                this.pageDragging = false;
                return;
            }
        }
    },

    _calculateVelocityOfTouch: function() {
        var vel = {x: 0, y: 0};

        for (var i = 0 ; i < this.lastTouches.length ; i++) {
            vel.x += this.lastTouches[i].dx / this.lastTouches[i].dt;
            vel.y += this.lastTouches[i].dy / this.lastTouches[i].dt;
        }
        vel.x /= this.lastTouches.length;
        vel.y /= this.lastTouches.length;
        if (this.vx === Infinity || isNaN(this.vx)) {
            this.vx = 0;
        }
        if (this.vy === Infinity || isNaN(this.vy)) {
            this.vy = 0;
        }

        vel.x *= -1;
        vel.y *= -1;

        return vel;
    },

    _recordInLastTouches: function(touch) {
        var x = touch.pageX;
        var y = touch.pageY;
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
    },


    _setPagePos: function(x,y) {
        if (isNaN(x) || isNaN(y)) return;
        this.pageOffsetX = x;
        this.pageOffsetY = y;
        this.contentEl.css("transform", "translate(" + x + "px, " + y + "px)");
    },

    touchMove: function(e) {
        var oe = e.originalEvent;
        for (var t = 0 ; t < oe.touches.length ; t++) {
            if (oe.touches[t].identifier === this.touchid) {
                this._recordInLastTouches(oe.touches[t]);

                this.dx = this.touchx - oe.touches[t].pageX;
                this.dy = this.touchy - oe.touches[t].pageY;

                console.log("dx: " + this.dx);
                if (this.dx < -this.pageDragMin && this.parentView && !this.pageDragging) {
                    this.pageDragging = true;
                    this.touchx -= this.dx;
                    console.log("page dragging");
                }
                else if (this.dx < 0 && this.pageDragging) {
                    this._setPagePos(-this.dx, 0);
                    return false;
                }
            }
        }
    },

    animatePage: function() {
        var t = Date.now();
        var dt = t - this.last_t;
        this.last_t = t;

        if (this.dx > -window.innerWidth * 0.5) {
            this.vx += 0.05;
        } else {
            this.vx -= 0.05;
        }

        if (Math.abs(this.vx) > this.max_v) {
            this.vx = (this.vx > 0 ? 1 : -1) * this.max_v;
        }
        if (Math.abs(this.vy) > this.max_v) {
            this.vy = (this.vy > 0 ? 1 : -1) * this.max_v;
        }

        this.dx += this.vx * dt;
        this.dy += this.vy * dt;

        this._setPagePos(-this.dx, 0);
        if (this.dx <= -window.innerWidth) {
            if (this.parentRoute) {
                router.navigate(this.parentRoute, {trigger: true});
                this._setPagePos(0, 0);
            }
        } else if (this.dx < -window.innerWidth) {
            this._setPagePos(window.innerWidth+10, 0);
        } else if (this.dx >= 0) {
            this._setPagePos(0, 0);
        } else if (Math.abs(this.vx) > 0.001 || Math.abs(this.vy) > 0.001) {
            requestAnimationFrame(this.animatePage.bind(this));
        }
    },
});

module.exports = AppView;
