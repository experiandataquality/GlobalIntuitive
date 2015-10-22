  ContactDataServices.insertMap = function(mapEndpoint) {

    if (typeof mapEndpoint !== "string") {
      return false;
    }

    // Instantiate the map object
    ContactDataServices.map = null;

    // Get coords, if available
    var coords = ContactDataServices.coords || {};

    // Create script element
    var script = document.createElement("script");
    script.src = mapEndpoint;
    script.async = true;

    // Insert the script in the page
    document.getElementsByTagName("head")[0].appendChild(script);

    return true;

  };

  ContactDataServices.loadMap = function () {
    var mapSelector = ContactDataServices.selectors.map;
    ContactDataServices.map = new GeolocationMap(mapSelector);

    ContactDataServices.map.pan(ContactDataServices.coords);
  };