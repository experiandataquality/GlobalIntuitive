 
    // Create ContactDataServices constructor and namespace on the window object (if not already present)
    var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};

    // Global settings
    ContactDataServices.selectors = {
      main: "#contact-data-services-container",
      map: "#contact-data-services-map",
      controls: "#contact-data-services-controls"
    };

    ContactDataServices.classes = {
      mapLoaded: "contact-data-services-map-loaded"
    };

    ContactDataServices.mapEndpoint = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=ContactDataServices.loadMap";
    