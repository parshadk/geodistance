require([
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/geometryEngine",
    "esri/Graphic"
], function (Map, MapView, Point, Polyline, geometryEngine, Graphic) {
    
    // Create a map and view
    var map = new Map({
        basemap: "streets-navigation-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-118.71511,34.09042], // Long, Lat
        zoom: 10
    });

    var points = [];

    view.on("click", function(event) {
        // Create a point geometry
        var point = new Point({
            longitude: event.mapPoint.longitude,
            latitude: event.mapPoint.latitude,
            spatialReference: view.spatialReference
        });

        // Add point to the points array
        points.push(point);

        // Create a graphic for the point
        var pointGraphic = new Graphic({
            geometry: point,
            symbol: {
                type: "simple-marker",
                color: "blue",
                size: "8px"
            }
        });

        // Add the point graphic to the view
        view.graphics.add(pointGraphic);

        if (points.length === 2) {
            // Create a polyline using the two points
            var polyline = new Polyline({
                paths: [
                    [points[0].longitude, points[0].latitude],
                    [points[1].longitude, points[1].latitude]
                ],
                spatialReference: view.spatialReference
            });

            // Calculate the geodesic distance between two points in meters
            var distanceMeters = geometryEngine.geodesicLength(polyline, "meters");
            
            // Convert to kilometers
            var distanceKilometers = distanceMeters ;

            // Create a text graphic to display the distance
            var textGraphic = new Graphic({
                geometry: points[1],
                symbol: {
                    type: "text",
                    color: "red",
                    text: distanceKilometers.toFixed(2) + " km",
                    xoffset: 3,
                    yoffset: 3,
                    font: {
                        size: 14,
                        family: "Arial"
                    }
                }
            });

            // Add the text graphic to the view
            view.graphics.add(textGraphic);

            // Clear the points array for new input
            points = [];
        }
    });
});