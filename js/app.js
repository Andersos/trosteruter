requirejs.config({
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
});

requirejs([
    'zepto',
    'app-gui',
    'ruter-rest',
    'predicter'
], function($, AppGui, RuterRest, Predicter) {

    // Define some waypoints
    var waypoints = [{
        'name'   : 'Stortinget',
        'lat'    : 59.91300,
        'lng'    : 10.74186,
        'station': RuterRest.stations.stortinget
    }, {
        'name'   : 'Trosterud',
        'lat'    : 59.92711,
        'lng'    : 10.86402,
        'station': RuterRest.stations.trosterud
    }];

    // Initialize classes
    var gui     = new AppGui(document.body)
      , predict = new Predicter()
      , ruter   = new RuterRest();

    // Maintain app state
    var App = {
        
        currentStation: RuterRest.stations.trosterud,
        
        fetchDepartures: function() {
            
            // Set destination name
            gui.setDestinationName(
                ruter.getDestinationName(App.currentStation)
            );

            // Set loading state
            gui.setLoadingState();

            // Fetch departures
            ruter.fetchDepartures(
                App.currentStation,
                gui.setDepartures.bind(gui)
            );

            // Start timer if not already done
            App.startTimer();
        },

        startTimer: function() {
            if (App.timer) {
                return;
            }

            App.timer = setInterval(App.fetchDepartures, 15 * 1000);
        }

    };

    // If clicking the flip button...
    gui.setOnFlipHandler(function() {
        if (App.currentStation == RuterRest.stations.trosterud) {
            App.currentStation = RuterRest.stations.stortinget;
        } else {
            App.currentStation = RuterRest.stations.trosterud;
        }

        // Set station name
        gui.setDestinationName(
            ruter.getDestinationName(App.currentStation)
        );

        // Fetch departures for new station
        App.fetchDepartures();
    });

    // Predict where we want to go
    predict.setWaypoints(waypoints);
    predict.geoPredict(function(nearestStation) {
        // Set app state
        App.currentStation = nearestStation;

        // Fetch departures for station
        App.fetchDepartures();
    });

});