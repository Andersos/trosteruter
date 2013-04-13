define(['zepto'], function($) {
    
    var Dots = function(el, speed) {
        this.el    = $(el);
        this.dots  = this.el.text().length;
        this.speed = speed || 250;

        this.bind();
        this.start();
    };

    $.extend(Dots.prototype, {
        bind: function() {
            this.el.on('DOMNodeRemoved', this.stop.bind(this));
        },

        start: function() {
            this.timer = setInterval(this.tick.bind(this), this.speed);
        },

        stop: function(e) {
            if (e && e.target.nodeType == 3) {
                // Text node changes are expected
                return;
            }

            clearInterval(this.timer);
        },

        repeat: function(num) {
            return new Array(num + 1).join('.');
        },

        tick: function() {
            if (++this.dots == 4) {
                this.dots = 1;
            }

            this.el.text(this.repeat(this.dots));
        }
    });

    return Dots;

});