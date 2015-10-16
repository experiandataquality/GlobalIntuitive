
    // Create ContactDataServices constructor and namespace on the window object (if not already present)
    var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};
    
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
        }

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
        }

        // Return the new events object to be used by whoever invokes this factory
        return events;
	}

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
				if(instance.formattedAddress.heading != false){
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
				for (var i = 0; i < addressLineInputs.length; i++) {
  					addressLineInputs[i].classList.remove("hidden");
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

		// Use this to initiate and track XMLHttpRequests
		instance.request = {
			currentRequest: null,
			get: function(url, callback){
				instance.request.currentRequest = new XMLHttpRequest();
				instance.request.currentRequest.open('GET', url, true);
				instance.request.currentRequest.timeout = 5000; // 5 seconds

				instance.request.currentRequest.onload = function() {
				  if (instance.request.currentRequest.status >= 200 && instance.request.currentRequest.status < 400) {
				    // Success!
				    var data = JSON.parse(instance.request.currentRequest.responseText);
				    console.log(data);
				    callback(data);
				  } else {
				    // We reached our target server, but it returned an error
 					instance.searchSpinner.hide();

 					// If the request is unauthorized we should probably disable future requests
 					if(instance.request.currentRequest.status === 401){
						instance.enabled = false;
 					}
				  }
				};

				instance.request.currentRequest.onerror = function() {
				  // There was a connection error of some sort
				};

				instance.request.currentRequest.ontimeout = function() {
				  // There was a connection timeout			  
				};

				instance.request.currentRequest.send();
			}		
		};	

		// Initialise this instance of ContactDataServices
		instance.init();

		// Return the instance object to the invoker
		return instance;
	};	
