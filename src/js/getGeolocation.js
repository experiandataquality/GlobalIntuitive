
  ContactDataServices.getGeolocation = function(onWaiting, onSuccess, onBlocked) {

    ContactDataServices.coords = {}; // will become eg { lat: -0.123, lng: 1.123 } on success

    var getCoords = new GeolocationActions(ContactDataServices.coords, onWaiting, onSuccess, onBlocked);

  };

  // TODO move this into main.js or another more relevant place
  // Get geolocation and draw map
  ContactDataServices.getGeolocation(
    function(){ console.log("waiting for geolocation permission..."); },            // OnWaiting
    function(){ ContactDataServices.insertMap(ContactDataServices.mapEndpoint); },  // OnSuccess
    function(){ console.log("geolocation was blocked or unavailable"); }            // OnBlocked
  );