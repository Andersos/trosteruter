define(['zepto', 'moment', 'departure'], function($, moment, Departure) {
    
    // Use norwegian language settings for moment.js
    moment.lang('nb');

    // Define a class for fetching data from Ruter
    var RuterRest = function() {};

    // Define some constants
    RuterRest.baseUrl = 'http://reis.trafikanten.no/ReisRest/RealTime/GetRealTimeData/';
    RuterRest.stations = {
        "trosterud" : 3011540,
        "stortinget": 3010020
    };
    RuterRest.destinationNames = {
        // From => to
        3011540: 'byen',
        3010020: 'Trosterud'
    };
    RuterRest.validEndStations = {
        // When going to Stortinget, valid stops are Stortinget, Frognerseteren and Gjønnes
        3011540: [2190180, 3010020, 3012630],

        // When going to Trosterud, the only valid stop is Ellingsrudsåsen
        3010020: [3011630]
    };

    // Now extend the class with our business logic
    $.extend(RuterRest.prototype, {

        fetchDepartures: function(station, callback) {
            $.getJSON(
                RuterRest.baseUrl + station + '?callback=?',
                this.parseDepartures.bind(this, station, callback)
            );
        },

        parseDepartures: function(station, callback, departures) {
            departures = this.filterDepartures(station, departures);
            departures = departures.map(function(item) {
                // Parse ASP.net-style date
                var date = moment(item.ExpectedDepartureTime);

                // For timestamps near the current date, use relative values, otherwise use HH:MM
                var time = date.diff(moment()) > 1800000 ? date.format('HH:mm') : date.fromNow();

                // Return a simplified, stripped-down version
                return new Departure({
                    'time': time.replace(/^om /, ''),
                    'line': item.LineRef
                });
            });

            callback(departures);
        },

        filterDepartures: function(station, departures) {
            return departures.filter(function(item) {
                return RuterRest.validEndStations[station].indexOf(item.DestinationRef) > -1;
            });
        },

        getDestinationName: function(departureStation) {
            return RuterRest.destinationNames[departureStation];
        }
    });

    return RuterRest;

});