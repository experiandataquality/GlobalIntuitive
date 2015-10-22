
  ContactDataServices.getGeolocation = function(onWaiting, onSuccess, onBlocked) {

    ContactDataServices.coords = {}; // will become eg { lat: -0.123, lng: 1.123 } on success

    var getCoords = new GeolocationActions(ContactDataServices.coords);

  };