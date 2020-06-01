// Generate the URLs for the various requests
ContactDataServices.urls = {
  endpoint: "https://api.experianaperture.io/address/search/v1",
  construct: {
    address: {
      // Construct the Search URL
      searchUrl: function(){
        return ContactDataServices.urls.endpoint;
      },
      searchData: function(instance){
        var data = {
          country_iso: instance.currentCountryCode,
          components: {unspecified: [encodeURIComponent(instance.currentSearchTerm)]},
          dataset: instance.currentDataSet,
          take: (instance.maxSize || instance.picklist.maxSize)
        };

        if (instance.elements.location) {
          data.location = instance.elements.location;
        }
        return JSON.stringify(data);
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