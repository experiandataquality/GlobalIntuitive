var contactDataServices = {	
	urls: {
		endpoint: "http://int-test-01/capture/v2/search",
		construct: {
			address: {
				// Construct the Search URL by appending query, country & token
				search: function(searchTerm, countryCode){
					var url = contactDataServices.urls.endpoint;
					url += "?query=" + contactDataServices.address.currentSearchTerm;
					url += "&country=" + contactDataServices.address.currentCountryCode;

					url = contactDataServices.urls.addToken(url);
					return url;
				},
				// Construct the Format URL by appending the token
				format: function(url){
					url = contactDataServices.urls.addToken(url);
					return url;
				}
			}
		},
		// Append the token (this must be specified when initialising)
		addToken: function(url){
			return url + "&auth-token=" + contactDataServices.token;
		}
	},
	// Merge in any settings the user wants to override
	mergeSettings: function(destination, source) {
	  for (var property in source) {
	    if (source[property] && source[property].constructor &&
	     source[property].constructor === Object) {
	      destination[property] = destination[property] || {};
	      arguments.callee(destination[property], source[property]);
	    } else {
	      destination[property] = source[property];
	    }
	  }
	  return destination;
	},
	init: function(options){
		// Merge in any overrides (such as token, elements IDs etc.)
		contactDataServices = contactDataServices.mergeSettings(contactDataServices, options);

		if(!contactDataServices.token){
			console.log("Please provide a token for ContactDataServices.");
		}

		contactDataServices.address.setCountryList();
		contactDataServices.address.input = contactDataServices.address.elements.input;
		contactDataServices.address.input.addEventListener("keyup", contactDataServices.address.search);
	},
	address: {
		input: null,
		lastSearchTerm: "",
		currentSearchTerm: "",
		lastCountryCode: "",
		currentCountryCode: "",
		currentSearchUrl: "",
		currentFormatUrl: "",
		// Main function to search for an address from an input string
		search: function(){
			console.log(contactDataServices.address.input.value);
			contactDataServices.address.currentSearchTerm = contactDataServices.address.input.value,
			contactDataServices.address.currentCountryCode = contactDataServices.address.countryList.value;

			// Check is searching is permitted
			if(contactDataServices.address.canSearch()){
				// Abort any outstanding requests
				if(contactDataServices.request.currentRequest){
					contactDataServices.request.currentRequest.abort();
				}
				// Construct the new Search URL
				var url = contactDataServices.urls.construct.address.search();
				contactDataServices.address.lastSearchTerm = contactDataServices.address.currentSearchTerm;				
				// Hide any previous results
				contactDataServices.address.result.hide();
				
				// Check in the cache for a previous match
				var cachedData = contactDataServices.address.cache.checkCache(contactDataServices.address.currentSearchTerm);
				if(cachedData){
					// Show cached copy
					contactDataServices.address.picklist.show(cachedData);
				} else {
					// Initiate new Search request
					contactDataServices.request.get(url, contactDataServices.address.picklist.show);
				}
			} else if (contactDataServices.address.currentSearchTerm === "") {
				// Clear the picklist if the search term is cleared/empty
				contactDataServices.address.picklist.hide();
			}
		},
		canSearch: function(){
			// If search term is not empty and not the same as previous search term
			return (contactDataServices.address.currentSearchTerm !== "" && contactDataServices.address.lastSearchTerm !== contactDataServices.address.currentSearchTerm);
		},
		// Bind a list of countries. Using either a user-defined list or creating a new one.
		setCountryList: function(){
			contactDataServices.address.countryList = contactDataServices.address.elements.countryList;
			
			// If the user hasn't passed us a country list, then create new list
			if(!contactDataServices.address.countryList){
				contactDataServices.address.createCountryDropdown();
			}
		},
		createCountryDropdown: function(){
			// What countries?
			// Where to position it?
		},
		// Get a final (Formatted) address
		format: function(url){
			contactDataServices.address.currentFormatUrl = contactDataServices.urls.construct.address.format(url);
			
			// Check in the cache for a previous match
			var cachedData = contactDataServices.address.cache.checkCache(contactDataServices.address.currentFormatUrl);
			if(cachedData){
				// Show cached copy
				contactDataServices.address.result.show(cachedData);
			} else {
				// Initiate a new Format request
				contactDataServices.request.get(contactDataServices.address.currentFormatUrl, contactDataServices.address.result.show);	
			}			
		},	
		picklist: {
			// Render a picklist of search results
			show: function(items){
				contactDataServices.address.picklist.hide();
				// Update the cache for this result
				contactDataServices.address.cache.updateCache(contactDataServices.address.currentSearchTerm, items);
					
				// Get picklist container element
				var picklist = contactDataServices.address.elements.picklist;
				// Prepend an option for "use address entered"
				contactDataServices.address.picklist.createUseAddressEntered();
				
				if(items.results.length > 0){	
					// Iterate over and show results
					items.results.forEach(function(item, i){
						// Create a new item/row in the picklist
						var listItem = contactDataServices.address.picklist.createListItem(item);
						picklist.appendChild(listItem);
						// Listen for selection on this item
						contactDataServices.address.picklist.listen(listItem);
					});
				}
			},
			hide: function(){
				contactDataServices.address.elements.picklist.innerHTML = "";
			},
			// Create a "use address entered" option
			createUseAddressEntered: function(){
				var item = {
					suggestion: "<em>Use address entered</em>",
					format: ""
				};
				var listItem = contactDataServices.address.picklist.createListItem(item);
				contactDataServices.address.elements.picklist.appendChild(listItem);
				listItem.addEventListener("click", contactDataServices.address.picklist.useAddressEntered);
			},
			// Use the address entered as the Formatted address
			useAddressEntered: function(){
				var inputData = {
					address: [
						{
							content: contactDataServices.address.currentSearchTerm
						}
					]
				};
				contactDataServices.address.result.show(inputData);
			},
			// Create a new picklist item/row
			createListItem: function(item){
				var row = document.createElement("div");
				row.innerHTML = contactDataServices.address.picklist.addMatchingEmphasis(item);
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
			listen: function(row){
				row.addEventListener("click", contactDataServices.address.picklist.pick);
			},
			pick: function(){
				// How to handle a picklist selection
				contactDataServices.address.format(this.getAttribute("format"));
			}
		},
		result: {
			// Render a Formatted address
			show: function(data){
				contactDataServices.address.picklist.hide();
				// Update the cache
				contactDataServices.address.cache.updateCache(contactDataServices.address.currentFormatUrl, data);

				if(data.address.length > 0){
					// Get formatted address container element
					var formattedAddress = contactDataServices.address.elements.formattedAddress;
					data.address.forEach(function(line, i){
						var row = document.createElement("div");
						row.innerHTML = line.content;
						formattedAddress.appendChild(row);
					});
				}
			},
			hide: function(){
				contactDataServices.address.elements.formattedAddress.innerHTML = "";
			}
		},
		cache: {
			data: {},
			checkCache: function(key){
				return contactDataServices.address.cache.data[key];
			},
			updateCache: function(key, data){
				contactDataServices.address.cache.data[key] = data;
			}
		}
	},
	request: {
		currentRequest: null,
		get: function(url, callback){
			contactDataServices.request.currentRequest = new XMLHttpRequest();
			contactDataServices.request.currentRequest.open('GET', url, true);
			contactDataServices.request.currentRequest.timeout = 5000; // 5 seconds

			contactDataServices.request.currentRequest.onload = function() {
			  if (contactDataServices.request.currentRequest.status >= 200 && contactDataServices.request.currentRequest.status < 400) {
			    // Success!
			    var data = JSON.parse(contactDataServices.request.currentRequest.responseText);
			    console.log(data);
			    callback(data);
			  } else {
			    // We reached our target server, but it returned an error

			  }
			};

			contactDataServices.request.currentRequest.onerror = function() {
			  // There was a connection error of some sort
			};

			contactDataServices.request.currentRequest.ontimeout = function() {
			  // There was a connection timeout			  
			};

			contactDataServices.request.currentRequest.send();
		}		
	}
};