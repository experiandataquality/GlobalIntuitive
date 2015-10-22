var GeolocationMap = function(elementSelector) {

  // Private map options
  // Pretty much all user interaction is disabled. Thinking about it,
  // Perhaps we should use the image API instead. Less overhead?
  var mapOptions = {
    mapTypeControl: false, // map type control, eg map/satellite
    streetViewControl: false, // yellow man
    scaleControl: false, // scale control 
    zoomControl: false, // zoom control
    panControl: false, // whether user can pan the map
    scrollwheel: false, // whether user can scroll to zoom
    keyboardShortcuts: false, // whether keyboard shortcuts are allowed
    draggable: false, // whether map can be dragged
        
    backgroundColor: "none",
    zoom: 14, // zoom level - max is 21
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  var map = new google.maps.Map(
    document.querySelector(elementSelector),
    mapOptions  
  );
  
  map.pan = function(coords) {
    if (typeof coords.lat !== "number" ||
        typeof coords.lng !== "number") {
      return false;
    }
    var latLng = new google.maps.LatLng(coords.lat, coords.lng);
    map.panTo(latLng);
    return true;
  };
  
  return map;

};