
/**
 * @constructor - adds lat and lng props to provided object, runs callbacks, indicates success
 *
 * @param {object} latLngObj - object to add lat and lng props to
 * @param {function} onSuccess - function to run on success. Can reference latLngObj 
 * @param {function} onBlocked - function to run on fail (usualy because user blocked geolocation)
 * @param {object} [w] - optional window object to use (for testability)
 *
 * @example
 * var pos = {}; // will become { lat: -0.123, lng: 1.123 } on success
 * var geoSuccess = function() { console.log(pos.lat + ", " + pos.lng) };
 * var geoBlocked = function(){ console.log("blocked :(") };
 * var geoCoords = new GeolocationActions(pos, geoSuccess, geoBlocked); // Will become true or false
 *
 * @returns {boolean} indicating success. Also adds lat and lng props to provided latLngObj object
 */
var GeolocationActions = function(latLngObj, onSuccess, onBlocked, w) {

  // Make sure latLngObj is an object
  latLngObj = (typeof latLngObj === "object") ? latLngObj : {};

  // Make sure callbacks are functions
  onSuccess = (typeof onSuccess === "function") ? onSuccess : function(){};
  onBlocked = (typeof onBlocked === "function") ? onBlocked : function(){};

  // Make sure a window object is defined
  w = (typeof w === "object") ? w : window;

  // Auto-fail if geolocation is not supported
  if (!w.navigator.geolocation) {
    onBlocked();
    return false;
  }

  // Get geolocation and run appropriate callback
  w.navigator.geolocation.getCurrentPosition(

    // Success method
    function(position) {
      latLngObj.lat = position.coords.latitude;
      latLngObj.lng = position.coords.longitude;

      if (latLngObj.lat && latLngObj.lng) {
        onSuccess();
        return true;
      }
    },
    
    // Fail method (usually because blocked by user)
    function() {
      onBlocked();
      return false;
    }
  );

};