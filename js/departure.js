define(['zepto'], function($) {
    
    var Departure = function(dep) {
        this.line = dep.line;
        this.time = dep.time;
    };

    $.extend(Departure.prototype, {
        render: function() {
            var item = $('<li />')
              , line = $('<span />');

            line.addClass('line')
                .text(this.line);
            
            item.text(this.time)
                .prepend(line);

            return item;
        }
    });

    return Departure;

});