/**
 * Created by Niharika Ganesh 26 Nov 2021
 */
requirejs(['./WorldWindShim',
        './LayerManager','./satellite.min'],
    function (WorldWind,
              LayerManager,satellite) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");
        wwd.navigator.lookAtLocation.latitude = 19.07;
        wwd.navigator.lookAtLocation.longitude = 73.37;
        wwd.navigator.range = 2e6; 
        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Define the images we'll use for the placemarks.
        var images = [
            "g1.png",
        ];

        var pinLibrary = WorldWind.configuration.baseUrl + "images/pushpins/", // location of the image files
            placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            //latitude = 47.684444,
            //longitude = -121.129722;
	    //mumbai added by mumbaikar Ganesh khopade	
	    latitude = 19.06,
	    longitude = 73.40,
        height=1e6;

        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 10;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.RED;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

        // For each placemark image, create a placemark with a label.

        //removed for loop
        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);

        // var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(40, 50, -120, -100),
        // pinLibrary + images[0]);


        



        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        //number of satellites to be spawned
        var n =1;
        var sat = [];
        var satAttrib = [];
        
        createSatelites(n);
           
        //Show Satellite animation
        var timeIndex = 0;
        var animationStep = 200;
        function animateTimeSeries() {


            // Increment the Blue Marble layer's time at a specified frequency.
            timeIndex = ++timeIndex;
            //placemark = new WorldWind.Placemark(new WorldWind.Position(latitude + timeIndex, longitude , 1e6), true, null);
            for (var i = 0; i < n; i++) {
                TLEtoGeo(); 
                sat[i].position = new WorldWind.Position(latitude , longitude, height);
            }
            wwd.redraw();

        }
      
        function createSatelites(n){
            // Create the placemark and its label.

            for (var i = 0; i < n; i++) {
               //sat[i]= new WorldWind.Placemark(new WorldWind.Position(latitude , longitude + i * 10 , 1e6), true, null);
               sat[i]= new WorldWind.Placemark(new WorldWind.Position(latitude , longitude, height), true, null);

               sat[i].label = "Sat " + i.toString() + "\n"
               + "Lat " + sat[i].position.latitude.toPrecision(4).toString() + "\n"
               + "Lon " + sat[i].position.longitude.toPrecision(5).toString();

               sat[i].altitudeMode = WorldWind.RELATIVE_TO_GROUND;
               sat[i].imageSource= pinLibrary + images[0];
                //placemark.targetVisibility =0;
                // Create the placemark attributes for this placemark. Note that the attributes differ only by their
                // image URL.
                satAttrib[i] = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                satAttrib[i].imageSource = pinLibrary + images[0];
                satAttrib[i].drawLeaderLine=false;
                satAttrib[i].imageColor =  WorldWind.Color.WHITE;
                
                //placemarkAttributes.imageScale=1;
                sat[i].attributes = satAttrib[i];


                // Add the placemark to the layer.
                placemarkLayer.addRenderable(sat[i]);
            }
    



        }

        function TLEtoGeo() {
            //             // Sample TLE
            // var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992',
            // tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';    
            var tleLine1 = '1 25544U 98067A   21274.25816815  .00005249  00000-0  10377-3 0  9993',
            tleLine2 = '2 25544  51.6450 178.2593 0004287  46.8394 104.8068 15.48887264305034';

            // Initialize a satellite record
            var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

            //  Propagate satellite using time since epoch (in minutes).
            var positionAndVelocity = satellite.sgp4(satrec, new Date());

            //  Or you can use a JavaScript Date
            var positionAndVelocity = satellite.propagate(satrec, new Date());

            // The position_velocity result is a key-value pair of ECI coordinates.
            // These are the base results from which all other coordinates are derived.
            var positionEci = positionAndVelocity.position,
            velocityEci = positionAndVelocity.velocity;

            // Set the Observer at 122.03 West by 36.96 North, in RADIANS
            var observerGd = {
            longitude: satellite.degreesToRadians(-122.0308),
            latitude: satellite.degreesToRadians(36.9613422),
            height: 0.370
            };

            // You will need GMST for some of the coordinate transforms.
            // http://en.wikipedia.org/wiki/Sidereal_time#Definition
            var gmst = satellite.gstime(new Date());

            // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
            var positionEcf   = satellite.eciToEcf(positionEci, gmst),
            observerEcf   = satellite.geodeticToEcf(observerGd),
            positionGd    = satellite.eciToGeodetic(positionEci, gmst),
            lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf),
            //dopplerFactor = satellite.dopplerFactor(observerCoordsEcf, positionEcf, velocityEcf);

            // The coordinates are all stored in key-value pairs.
            // ECI and ECF are accessed by `x`, `y`, `z` properties.
            satelliteX = positionEci.x,
            satelliteY = positionEci.y,
            satelliteZ = positionEci.z;

            // Look Angles may be accessed by `azimuth`, `elevation`, `range_sat` properties.
            var azimuth   = lookAngles.azimuth,
            elevation = lookAngles.elevation,
            rangeSat  = lookAngles.rangeSat;

            // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
            var longitudeTLE = positionGd.longitude,
            latitudeTLE  = positionGd.latitude,
            heightTLE    = positionGd.height;

            //  Convert the RADIANS to DEGREES.
            var longitudeDegTLE = satellite.degreesLong(longitudeTLE),
            latitudeDegTLE  = satellite.degreesLat(latitudeTLE);

            // //Assigning TLE coord to my satellite
            latitude = latitudeDegTLE;
            longitude = longitudeDegTLE;
            height = heightTLE;
            console.log(latitude + ' ' + longitude);
        }


          // Run the animation at the desired frequency.
          window.setInterval(animateTimeSeries, animationStep);

        

    });