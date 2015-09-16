(function (window, document, undefined) {
    var ContactDataServices = window.ContactDataServices = window.ContactDataServices || {};
    window.ContactDataServices = ContactDataServices;

    // Generate the URLs for the various requests
	ContactDataServices.urls = {
		endpoint: "http://int-test-01/capture/v2/search",
		construct: {
			address: {
				// Construct the Search URL by appending query, country & token
				search: function(instance){
					var url = ContactDataServices.urls.endpoint;
					url += "?query=" + instance.currentSearchTerm;
					url += "&country=" + instance.currentCountryCode;

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

		// Initialise this instance
		instance.init = function(){
			if(!instance.token){
				console.log("Please provide a token for ContactDataServices.");
				// Disable searching on this instance
				instance.enabled = false;
			}
			instance.setCountryList();
			instance.input = instance.elements.input;
			instance.input.addEventListener("keyup", instance.search);
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
			} else {
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
			// Render a picklist of search results
			show: function(items){
				instance.picklist.hide();
					
				// Get picklist container element
				var picklist = instance.elements.picklist;

				// Prepend an option for "use address entered"
				instance.picklist.createUseAddressEntered();
				
				if(items.results.length > 0){	
					// Iterate over and show results
					items.results.forEach(function(item, i){
						// Create a new item/row in the picklist
						var listItem = instance.picklist.createListItem(item);
						picklist.appendChild(listItem);
						// Listen for selection on this item
						instance.picklist.listen(listItem);
					});
				}
			},
			hide: function(){
				instance.elements.picklist.innerHTML = "";
			},
			// Create a "use address entered" option
			createUseAddressEntered: function(){
				var item = {
					suggestion: "<em>Use address entered</em>",
					format: ""
				};
				var listItem = instance.picklist.createListItem(item);
				instance.elements.picklist.appendChild(listItem);
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
				var highlights = item.emphasis || [],
                	label = item.suggestion;

                for (i = 0; i < highlights.length; i++) {
                    var replacement = '<b>' + label.substring(highlights[i][0], highlights[i][1]) + '</b>';
                    label = label.substring(0, highlights[i][0]) + replacement + label.substring(highlights[i][1]);
                }

                return label;
			},
			// Listen to a picklist selection
			listen: function(row){
				row.addEventListener("click", instance.picklist.pick);
			},
			// How to handle a picklist selection				
			pick: function(){
				instance.format(this.getAttribute("format"));
			}
		};

		instance.result = {
			// Render a Formatted address
			show: function(data){
				instance.picklist.hide();
				
				if(data.address.length > 0){
					// Get formatted address container element
					var formattedAddress = instance.elements.formattedAddress;
					data.address.forEach(function(line, i){
						var row = document.createElement("div");
						row.innerHTML = line.content;
						formattedAddress.appendChild(row);
					});
				}
			},
			hide: function(){
				instance.elements.formattedAddress.innerHTML = "";
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