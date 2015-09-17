(function (window, document, undefined) {
    var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};
    window.ContactDataServices = ContactDataServices;

    // Generate the URLs for the various requests
	ContactDataServices.urls = {
		endpoint: "http://int-test-01/capture/v2/address/search",
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

	// Integrate with address searching
	ContactDataServices.address = function(options){
		// Build our new instance from user defaults
		var instance = options || {};
				
		instance.lastSearchTerm = "";
		instance.currentSearchTerm = "";
		instance.lastCountryCode = "";
		instance.currentCountryCode = "";
		instance.currentSearchUrl = "";
		instance.currentFormatUrl = "";		
		instance.enabled = true;
		instance.placeholder = instance.placeholder || "Start typing an address";

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
				instance.input.addEventListener("keyup", instance.search);
				instance.input.setAttribute("placeholder", instance.placeholder);
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
			instance.currentFormatUrl = ContactDataServices.urls.construct.address.format(url, instance);
			
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
					suggestion: "<em>Use address entered</em>",
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
				instance.picklist.hide();
				
				if(data.address.length > 0){
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
				// Insert the container after the input
				instance.input.parentNode.insertBefore(container, instance.input.nextSibling);
				return container;
			},
			createAddressLine: {
				// Create a hidden input to store the address line
				input: function(key, value){
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					input.setAttribute("name", key);
					input.setAttribute("value", value);
					return input;
				},
				// Create a DOM element to contain the address line
				row: function(value){
					var row = document.createElement("div");
					row.innerHTML = value;
					return row;
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

})(window, window.document);