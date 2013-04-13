define(['zepto', 'dots'], function($, Dots) {
    
    var TrosteruterGui = function(el) {
        this.init(el);
        this.bind();
    };

    $.extend(TrosteruterGui.prototype, {
        init: function(el) {
            this.elements = {
                'root'       : $(el),
                'main'       : $('main', el),
                'flip'       : $('.flip', el),
                'window'     : $(window),
                'loading'    : $('.loading-dots', el),
                'destination': $('.destination', el)
            };
        },

        bind: function() {
            this.elements.flip.on('click', this.flipDestination.bind(this));
            
            this.loading = new Dots(this.elements.loading);

            this.elements.window.on(
                'resize',
                this.onResize.bind(this)
            ).trigger('resize');
        },

        flipDestination: function() {
            // Flip GUI elements and clear time table right away
            // to signal that we're working on it
            this.elements.main.empty();
            this.onFlipHandler();
        },

        setLoadingState: function() {
            this.elements.flip.addClass('loading');
            
            this.loadingTimer = setInterval(function() {
                this.elements.flip.toggleClass('loading');
            }.bind(this), 1650);
        },

        clearLoadingState: function() {
            clearInterval(this.loadingTimer);
            this.elements.flip.removeClass('loading');
        },

        setOnFlipHandler: function(handler) {
            this.onFlipHandler = handler;
        },

        setDestinationName: function(stationName) {
            this.elements.destination.text(stationName);
        },

        setDepartures: function(departures) {
            this.clearLoadingState();
            this.elements.main.empty();

            for (var i = 0; i < departures.length; i++) {
                this.elements.main.append(departures[i].render());
            }
        },

        onResize: function() {
            if (this.elements.window.width() > this.elements.window.height()) {
                this.elements.main.addClass('horizontal');
            } else {
                this.elements.main.removeClass('horizontal');
            }
        }
    });

    return TrosteruterGui;

});