// Generate the URLs for the various requests
ContactDataServices.urls = {
  endpoint: "https://api.edq.com/capture/address/v2/search",
  construct: {
    address: {
      // Construct the Search URL by appending query, country & take
      search: function(instance){
        var url = ContactDataServices.urls.endpoint;
        url += "?query=" + encodeURIComponent(instance.currentSearchTerm);
        url += "&country=" + instance.currentCountryCode;

        if (instance.elements.location) {
          url += "&location=" + instance.elements.location;
        }

        url += "&take=" + (instance.maxSize || instance.picklist.maxSize);
        url += "&auth-token=" + instance.token;
        return url;
      },
      // Append the token to the Format URL
      format: function(url, instance){
        return url + "&auth-token=" + instance.token;
      }
    }
  },
  // Get token from query string and set on instance
  getToken: function(instance){
    if(!instance.token) {
      instance.token = ContactDataServices.urls.getParameter("token");
    }
  },
  getParameter: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
};