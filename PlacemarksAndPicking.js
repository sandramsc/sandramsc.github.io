/**
 * Created by Niharika Ganesh 26 Nov 2021
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
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
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
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
	    longitude = 73.40;

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

        var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(40, 50, -120, -100),
        pinLibrary + images[0]);



        var highlightedItems = [];

        

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
       // wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        //var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        var timeIndex = 0;
        var animationStep = 200;

        // Create the placemark and its label.
        placemark = new WorldWind.Placemark(new WorldWind.Position(latitude , longitude , 1e6), true, null);
        placemark.label = "Placemark " + timeIndex.toString() + "\n"
            + "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
            + "Lon " + placemark.position.longitude.toPrecision(5).toString();
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.imageSource= pinLibrary + images[0];
        //placemark.targetVisibility =0;
        // Create the placemark attributes for this placemark. Note that the attributes differ only by their
        // image URL.
        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        placemarkAttributes.imageSource = pinLibrary + images[0];
        placemarkAttributes.drawLeaderLine=false;
        placemarkAttributes.imageColor =  WorldWind.Color.WHITE;
        
        //placemarkAttributes.imageScale=1;
        placemark.attributes = placemarkAttributes;
        

        // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
        // the default highlight attributes so that all properties are identical except the image scale. You could
        // instead vary the color, image, or other property to control the highlight representation.
        highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;
        placemark.highlightAttributes = highlightAttributes;

        // Add the placemark to the layer.
        placemarkLayer.addRenderable(placemark);
        //surfaceImageLayer.addRenderable(surfaceImage1);
        

        function animateTimeSeries() {


            // Increment the Blue Marble layer's time at a specified frequency.
            timeIndex = ++timeIndex;
            //placemark = new WorldWind.Placemark(new WorldWind.Position(latitude + timeIndex, longitude , 1e6), true, null);
            placemark.position = new WorldWind.Position(latitude + timeIndex, longitude , 1e6);
            wwd.redraw();

        }

        // Run the animation at the desired frequency.
        window.setInterval(animateTimeSeries, animationStep);
        

    });