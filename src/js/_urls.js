// Generate the URLs for the various requests
ContactDataServices.urls = {
	endpoint: "http://int-test-01/capture/address/v2/search",
	construct: {
		address: {
			// Construct the Search URL by appending query, country & take
			search: function(instance){
				var url = ContactDataServices.urls.endpoint;
				url += "?query=" + instance.currentSearchTerm;
				url += "&country=" + instance.currentCountryCode;
				url += "&take=" + (instance.maxSize || instance.picklist.maxSize);

				return url;
			}
		}
	},
	// Get token from query string and set on instance
	getToken: function(instance){
		instance.token = ContactDataServices.urls.getParameter("token");
	},
	getParameter: function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};
