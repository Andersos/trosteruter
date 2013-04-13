define(['zepto'], function($) {
    
    var Predicter = function() {
        this.waypoints = [];
    };

    $.extend(Predicter.prototype, {
        setWaypoints: function(points) {
            this.waypoints = points;
        },

        geoPredict: function(callback) {
            return navigator.geolocation.getCurrentPosition(
                this.onGeoSuccess.bind(this, callback),
                this.onGeoError.bind(this, callback)
            );
        },

        onGeoSuccess: function(callback, result) {
            // Sanity-check
            if (!result.coords || !result.coords.latitude) {
                return this.onGeoError(callback, {
                    message: 'No valid coordinates in Geo-response'
                });
            }

            // Find nearest station to current position
            this.waypoints.sort(this.distanceSorter.bind(
                this,
                result.coords
            ));

            return callback(this.waypoints[0].station);
        },

        onGeoError: function(callback, error) {
            console.log(error.message);
            // @todo add time-of-day prediction
            // For now, use first station
            callback(this.waypoints[0].station);
        },

        distanceSorter: function(current, a, b) {
            var aDist = this.distanceBetweenPoints(
                current.latitude,
                current.longitude,
                a.lat,
                a.lng
            );

            var bDist = this.distanceBetweenPoints(
                current.latitude,
                current.longitude,
                b.lat,
                b.lng
            );

            if (aDist == bDist) {
                return 0;
            }

            return aDist > bDist;
        },

        distanceBetweenPoints: function(lat1, lng1, lat2, lng2) {
            var R    = 6371
              , dLat = this.deg2rad(lat2 - lat1)
              , dLng = this.deg2rad(lng2 - lng1)
              , a    = Math.sin(dLat/2) * Math.sin(dLat / 2) +
                       Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                       Math.sin(dLng / 2) * Math.sin(dLng / 2)
              , c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
              , d    = R * c;
            
            return d;
        },

        deg2rad: function(deg) {
            return deg * (Math.PI / 180);
        }
    });

    return Predicter;

});