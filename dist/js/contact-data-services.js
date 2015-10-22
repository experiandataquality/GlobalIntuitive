/*! contact-data-services.js | https://github.com/TeamArachne/contactdataservices | Apache-2.0
*   Team Arachne, Experian Data Quality | team.arachne@gmail.com */

;(function(window, document, undefined) {

    "use strict";
 
    // Create ContactDataServices constructor and namespace on the window object (if not already present)
    var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};

    // Global settings
    ContactDataServices.selectors = {
      main: "#contact-data-services-container",
      map: "#contact-data-services-map",
      controls: "#contact-data-services-controls"
    };

    ContactDataServices.mapEndpoint = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=ContactDataServices.loadMap";
    

/**
 * @constructor - adds lat and lng props to provided object, runs callbacks, indicates success
 *
 * @param {object} latLngObj - object to add lat and lng props to
 * @param {function} onWaiting - function to run while waiting for geolocation permission
 * @param {function} onSuccess - function to run on success. Can reference latLngObj 
 * @param {function} onBlocked - function to run on fail (usualy because user blocked geolocation)
 * @param {object} [w] - optional window object to use (for testability)
 *
 * @example
 * var pos = {}; // will become eg { lat: -0.123, lng: 1.123 } on success
 * var geoWaiting = function() { console.log("waiting for permission...") };
 * var geoSuccess = function() { console.log(pos.lat + ", " + pos.lng) };
 * var geoBlocked = function() { console.log("blocked :(") };
 * var geoCoords = new GeolocationActions(pos, geoSuccess, geoBlocked); // Will become true or false
 *
 * @returns {boolean} indicating success. Also adds lat and lng props to provided latLngObj object
 */
var GeolocationActions = function(latLngObj, onWaiting, onSuccess, onBlocked, w) {

  // Make sure latLngObj is an object
  latLngObj = (typeof latLngObj === "object") ? latLngObj : {};

  // Make sure callbacks are functions
  onWaiting = (typeof onWaiting === "function") ? onWaiting : function(){};
  onSuccess = (typeof onSuccess === "function") ? onSuccess : function(){};
  onBlocked = (typeof onBlocked === "function") ? onBlocked : function(){};

  // Make sure a window object is defined
  w = (typeof w === "object") ? w : window;

  // Auto-fail if geolocation is not supported
  if (!w.navigator.geolocation) {
    onBlocked();
    return false;
  }

  // Run the onWaiting callback after a short delay
  // Will be cancelled if onSuccess or onBlocked are called immediately 
  var runOnWaiting = setTimeout(onWaiting, 500);

  // Get geolocation and run appropriate callback
  w.navigator.geolocation.getCurrentPosition(

    // Success method
    function(position) {
      latLngObj.lat = position.coords.latitude;
      latLngObj.lng = position.coords.longitude;

      if (latLngObj.lat && latLngObj.lng) {
        onSuccess();
        clearTimeout(runOnWaiting);
        return true;
      }
    },
    
    // Fail method (usually because blocked by user)
    function() {
      onBlocked();
      clearTimeout(runOnWaiting);
      return false;
    }
  );

};
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
// Generate the URLs for the various requests
ContactDataServices.urls = {
	endpoint: "http://int-test-01/capture/address/v2/search",
	construct: {
		address: {
			// Construct the Search URL by appending query, country & token
			search: function(instance){
				var url = ContactDataServices.urls.endpoint;
				url += "?query=" + instance.currentSearchTerm;
				url += "&country=" + instance.currentCountryCode;
				url += "&take=" + (instance.maxSize || instance.picklist.maxSize);

				url = ContactDataServices.urls.addToken(url, instance.token);
				return url;
			},
			// Construct the Format URL by appending the token
			format: function(url, instance){
				url = ContactDataServices.urls.addToken(url, instance.token);
				return url;
			}
		}
	},
	// Append the token (this must be specified when initialising)
	addToken: function(url, token){
		return url + "&auth-token=" + token;
	}
};

// Constructor method event listener (pub/sub type thing)
ContactDataServices.eventFactory = function(){
	// Create the events object
	var events = {};

	// Create an object to hold the collection of events
	events.collection = {};

	// Subscribe a new event
	events.on = function (event, action) {
        // Create the property array on the collection object
        events.collection[event] = events.collection[event] || [];
        // Push a new action for this event onto the array
        events.collection[event].push(action);
      };

    // Publish (trigger) an event
    events.trigger = function (event, data) {
        // If this event is in our collection (i.e. anyone's subscribed)
        if (events.collection[event]) {
            // Loop over all the actions for this event
            for (var i = 0; i < events.collection[event].length; i++) {
                // Create array with default data as 1st item
                var args = [data];

                // Loop over additional args and add to array
                for (var a = 2; a < arguments.length; a++){
                	args.push(arguments[a]);
                }

                // Call each action for this event type, passing the args
                events.collection[event][i].apply(events.collection, args);
              }
            }
          };

    // Return the new events object to be used by whoever invokes this factory
    return events;
  };

// Default settings
ContactDataServices.defaults = { 		
	input: { placeholder: "Start typing an address" },
	formattedAddress: { headingType: "h3", headingText: "Formatted address" },
	editAddressText: "Edit address",
	useAddressEnteredText: "<em>Use address entered</em>"
};

// Integrate with address searching
ContactDataServices.address = function(options){
	// Build our new instance from user custom options
	var instance = options || {};
	
	// Initialising some defaults
	instance.enabled = true;		
	instance.lastSearchTerm = "";
	instance.currentSearchTerm = "";
	instance.lastCountryCode = "";
	instance.currentCountryCode = "";
	instance.currentSearchUrl = "";
	instance.currentFormatUrl = "";	
	instance.placeholder = instance.placeholder || ContactDataServices.defaults.input.placeholder;	
	instance.editAddressText = instance.editAddressText || ContactDataServices.defaults.editAddressText; 
	instance.formattedAddress = instance.formattedAddress || ContactDataServices.defaults.formattedAddress;
	
	// Create a new object to hold the events from the event factory
	instance.events = new ContactDataServices.eventFactory();

	// Initialise this instance
	instance.init = function(){
		if(!instance.token){
			console.log("Please provide a token for ContactDataServices.");
			// Disable searching on this instance
			instance.enabled = false;
		}
		instance.setCountryList();
		if(instance.elements.input){
			instance.input = instance.elements.input;
			// Bind an event listener on the input
			instance.input.addEventListener("keyup", instance.search);
			// Set a placeholder for the input
			instance.input.setAttribute("placeholder", instance.placeholder);
			// Disable autocomplete on the form
			instance.input.parentNode.setAttribute("autocomplete", "off");
		}
	};
	
	// Main function to search for an address from an input string
	instance.search = function(){
		instance.currentSearchTerm = instance.input.value;
		instance.currentCountryCode = instance.countryList.value;

		// Check is searching is permitted
		if(instance.canSearch()){
			// Create a new request object from constructor
			var request = new ContactDataServices.requestFactory();
			instance.request = request;

			// Abort any outstanding requests
			if(instance.request.currentRequest){
				instance.request.currentRequest.abort();
			}
			// Construct the new Search URL
			var url = ContactDataServices.urls.construct.address.search(instance);

			// Store the last search term
			instance.lastSearchTerm = instance.currentSearchTerm;	

			// Hide any previous results
			instance.result.hide();
			
			// Hide the inline search spinner
			instance.searchSpinner.hide();

			// Show an inline spinner whilst searching
			instance.searchSpinner.show();

			// Initiate new Search request
			instance.request.get(url, instance.picklist.show);
		} else if(instance.lastSearchTerm !== instance.currentSearchTerm){
			// Clear the picklist if the search term is cleared/empty
			instance.picklist.hide();
		}
	};

	instance.setCountryList = function(){
		instance.countryList = instance.elements.countryList;
		
		// If the user hasn't passed us a country list, then create new list?
		if(!instance.countryList){
			instance.createCountryDropdown();
		}
	};
	
	// Determine whether searching is currently permitted
	instance.canSearch = function(){
				// If searching on this instance is enabled, and
				return (instance.enabled && 
				// If search term is not empty, and
				instance.currentSearchTerm !== "" && 
				// If search term is not the same as previous search term, and
				instance.lastSearchTerm !== instance.currentSearchTerm &&
				// If the country is not empty
				instance.countryList.value !== "");
			};

			instance.createCountryDropdown = function(){
		// What countries?
		// Where to position it?
	};

	// Get a final (Formatted) address
	instance.format = function(url){
		// Trigger an event
		instance.events.trigger("formatting-search", url);

		// Hide the searching spinner
		instance.searchSpinner.hide();

		// Construct the format URL
		instance.currentFormatUrl = ContactDataServices.urls.construct.address.format(url, instance);
		
		/* Temporary hack until Go Live*/
		if(instance.currentFormatUrl.indexOf("https://api.edq.com") > -1){
			instance.currentFormatUrl = instance.currentFormatUrl.replace("https://api.edq.com","http://int-test-01");
		}

		// Initiate a new Format request
		instance.request.get(instance.currentFormatUrl, instance.result.show);
	};	

	instance.picklist = {
		// Set initial size
		size: 0,
		// Set initial max size
		maxSize: 25,
		// Render a picklist of search results
		show: function(items){
			// Store the picklist items
			instance.picklist.items = items.results;

			// Update picklist size
			instance.picklist.size = instance.picklist.items.length;

			// Get/Create picklist container element
			instance.picklist.container = instance.picklist.container || instance.picklist.createList();

			// Ensure previous results are cleared
			instance.picklist.container.innerHTML = "";

			// Hide the inline search spinner
			instance.searchSpinner.hide();

			// Prepend an option for "use address entered"
			instance.picklist.createUseAddressEntered();
			
			if(instance.picklist.items.length > 0){	
				// Iterate over and show results
				instance.picklist.items.forEach(function(item){
					// Create a new item/row in the picklist
					var listItem = instance.picklist.createListItem(item);
					instance.picklist.container.appendChild(listItem);

					// Listen for selection on this item
					instance.picklist.listen(listItem);
				});
			}
		},
		// Remove the picklist
		hide: function(){
			if(instance.picklist.container){
				instance.input.parentNode.removeChild(instance.picklist.container);
				instance.picklist.container = undefined;
			}
		},
		// Create a "use address entered" option
		createUseAddressEntered: function(){
			var item = {
				suggestion: ContactDataServices.defaults.useAddressEnteredText,
				format: ""
			};
			var listItem = instance.picklist.createListItem(item);
			instance.picklist.container.appendChild(listItem);
			listItem.addEventListener("click", instance.picklist.useAddressEntered);
		},
		// Use the address entered as the Formatted address
		useAddressEntered: function(){
			var inputData = {
				address: [
				{
					content: instance.currentSearchTerm
				}
				]
			};
			instance.result.show(inputData);
		},
		// Create the picklist container and inject after the input
		createList: function(){
			var list = document.createElement("div");
			list.classList.add("address-picklist");
			// Insert the picklist after the input
			instance.input.parentNode.insertBefore(list, instance.input.nextSibling);
			return list;
		},
		// Create a new picklist item/row
		createListItem: function(item){
			var row = document.createElement("div");
			row.innerHTML = instance.picklist.addMatchingEmphasis(item);
			// Store the Format URL
			row.setAttribute("format", item.format);
			return row;
		},
		// Add emphasis to the picklist items highlighting the match
		addMatchingEmphasis: function(item){
			var highlights = item.matched || [],
			label = item.suggestion;

			for (var i = 0; i < highlights.length; i++) {
				var replacement = '<b>' + label.substring(highlights[i][0], highlights[i][1]) + '</b>';
				label = label.substring(0, highlights[i][0]) + replacement + label.substring(highlights[i][1]);
			}

			return label;
		},
		// Listen to a picklist selection
		listen: function(row){
			row.addEventListener("click", instance.picklist.pick.bind(null, row));
		},
		// How to handle a picklist selection				
		pick: function(item){
			instance.format(item.getAttribute("format"));
		}
	};

	instance.result = {
		// Render a Formatted address
		show: function(data){
			// Hide the inline search spinner
			instance.searchSpinner.hide();

			// Hide the picklist
			instance.picklist.hide();
			
			if(data.address.length > 0){
				// Fire an event to say we've got the formatted address
				instance.events.trigger("formatted-address", data);

				// Get formatted address container element
				instance.result.formattedAddress = instance.elements.formattedAddress || instance.result.createFormattedAddressContainer();

				// Create an array to hold the hidden input fields
				var inputArray = [];

				// Loop over each formatted address line
				for(var i = 0; i < data.address.length; i++){
					var line = data.address[i];
					// The line object will only have one property, but we don't know the key
					for(var key in line){
						if(line.hasOwnProperty(key)) {
							// Create the address line row and add to the DOM
							var row = instance.result.createAddressLine.row(line[key]);
							instance.result.formattedAddress.appendChild(row);

							// Create a hidden input to store the address line as well
							inputArray.push(instance.result.createAddressLine.input(key, line[key]));
						}
					}
				}

				// Write the list of hidden address line inputs to the DOM in one go
				instance.result.renderInputList(inputArray);

				// Write the 'Edit address' link and insert into DOM
				instance.result.createEditAddressLink();
			}
		},
		hide: function(){
			if(instance.result.formattedAddress){
				instance.input.parentNode.removeChild(instance.result.formattedAddress);
				instance.result.formattedAddress = undefined;
			}				
		},
		// Create the formatted address container and inject after the input
		createFormattedAddressContainer: function(){
			var container = document.createElement("div");
			container.classList.add("formatted-address");
			// Create a heading for the formatted address
			if(instance.formattedAddress.heading !== false){
				var heading = document.createElement(instance.formattedAddress.headingType);
				heading.innerHTML = instance.formattedAddress.headingText;
				container.appendChild(heading);
			}
			// Insert the container after the input
			instance.input.parentNode.insertBefore(container, instance.input.nextSibling);
			return container;
		},
		createAddressLine: {
			// Create a hidden input to store the address line
			input: function(key, value){
				// Create a wrapper (and hide it)
				var div  = document.createElement("div");
				div.classList.add("hidden");
				div.classList.add("address-line-input");

				// Create the label
				var label = document.createElement("label");
				label.innerHTML = key;
				div.appendChild(label);

				// Create the input
				var input = document.createElement("input");
				input.setAttribute("type", "text");
				input.setAttribute("name", key);
				input.setAttribute("value", value);
				div.appendChild(input);
				return div;
			},
			// Create a DOM element to contain the address line
			row: function(value){
				var row = document.createElement("div");
				row.classList.add("toggle");
				row.innerHTML = value;
				return row;
			}
		},
		// Create the 'Edit address' link that allows manual editing of address
		createEditAddressLink: function(){
			var link = document.createElement("a");
			link.setAttribute("href", "#");
			link.classList.add("edit-address-link");
			link.innerHTML = instance.editAddressText;
			// Insert into the formatted address container
			instance.result.formattedAddress.appendChild(link);
			// Bind event listener
			link.addEventListener("click", instance.result.editAddressManually);
		},
		editAddressManually: function(event){
			event.preventDefault();
			
			// Remove 'edit address link'
			instance.result.formattedAddress.querySelector(".edit-address-link").classList.add("hidden");

			// Change the visible formatted address to hidden
			var addressLines = instance.result.formattedAddress.querySelectorAll(".toggle");
			for (var i = 0; i < addressLines.length; i++) {
				addressLines[i].classList.add("hidden");
			}

			// Change the hidden address line inputs to show to allow editing
			var addressLineInputs = instance.result.formattedAddress.querySelectorAll(".address-line-input");
			for (var j = 0; j < addressLineInputs.length; j++) {
				addressLineInputs[j].classList.remove("hidden");
			}
		},
		// Write the list of hidden address line inputs to the DOM
		renderInputList: function(inputArray){
			if(inputArray.length > 0){
				for(var i = 0; i < inputArray.length; i++){
					instance.result.formattedAddress.appendChild(inputArray[i]);
				}
			}
		}
	};

	instance.searchSpinner = {
		show: function(){
			// Create the spinner container
			var spinnerContainer = document.createElement("div");
			spinnerContainer.classList.add("loader");
			spinnerContainer.classList.add("loader-inline");

		    // Create the spinner
		    var spinner = document.createElement("div");
		    spinner.classList.add("spinner");
		    spinnerContainer.appendChild(spinner);

			// Insert the spinner after the field
			instance.input.parentNode.insertBefore(spinnerContainer, instance.input.nextSibling);
		},

		hide: function(){
			var spinner = instance.input.parentNode.querySelector(".loader-inline");
			if(spinner){
				instance.input.parentNode.removeChild(spinner);
			}	
		}
	};		

	// Initialise this instance of ContactDataServices
	instance.init();

	// Return the instance object to the invoker
	return instance;
};	
// Use this to initiate and track XMLHttpRequests
ContactDataServices.requestFactory = function(){
	var request = {
		currentRequest: null,
		get: function(url, callback){
			request.currentRequest = new XMLHttpRequest();
			request.currentRequest.open('GET', url, true);
			request.currentRequest.timeout = 5000; // 5 seconds

			request.currentRequest.onload = function() {
				if (request.currentRequest.status >= 200 && request.currentRequest.status < 400) {
				    // Success!
				    var data = JSON.parse(request.currentRequest.responseText);
				    console.log(data);
				    callback(data);
				}
			};

			request.currentRequest.onerror = function() {
			  // There was a connection error of some sort
			};

			request.currentRequest.ontimeout = function() {
			  // There was a connection timeout			  
			};

			request.currentRequest.send();
		}
	};

	return request;
};	
})(window, window.document);
