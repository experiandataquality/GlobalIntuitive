describe("ContactDataServices", function() {

  describe("canSearch() is false if", function() {

    it("token doesn't exist", function() {

      // Arrange
      var options = {};

      // Act
      var address = new ContactDataServices.address(options);

      // Assert
      expect(address.canSearch()).toBe(false);

    });

    it("enabled is false", function() {

      // Arrange
      var options = {
        token: "1234567890"
      };

      // Act
      var address = new ContactDataServices.address(options);
      address.enabled = false;

      // Assert
      expect(address.canSearch()).toBe(false);

    });

    it("currentSearchTerm is empty", function() {

      // Arrange
      var options = {
        token: "1234567890"
      };

      // Act
      var address = new ContactDataServices.address(options);
      address.currentSearchTerm = "";

      // Assert
      expect(address.canSearch()).toBe(false);

    });

    it("no country list is provided", function() {

      // Arrange
      var options = {
        token: "1234567890",
        elements: {
          countryList: null
        }
      };

      // Act
      var address = new ContactDataServices.address(options);
      address.currentSearchTerm = "SW40QL";

      // Assert
      expect(address.canSearch()).toBe(false);

    });

    it("countryCodeMapping updates country code call to api ", function() {

      var countryMap = {"GB": "GBR"};
      var container = document.createElement("div");
      var input = document.createElement("input");
      container.appendChild(input);

      var selectList = document.createElement("select");
      selectList.name = "countryCode";
      //Create and append the options   
      var option = document.createElement("option");
      option.value = "GB";
      option.text = "UK";
      selectList.appendChild(option);

      option = document.createElement("option");
      option.value = "IRL";
      option.text = "Irland";
      selectList.appendChild(option);

      selectList.value ="GB";
      
      var options = {
        token: "1234567890",
        elements: {
            input: input,
            countryList: selectList,
            countryCodeMapping:countryMap,
          }
        };
     

      // Act
      var address = new ContactDataServices.address(options);
      address.search("Term");
      var url = ContactDataServices.urls.construct.address.search(address);

      // Assert
      expect(url.indexOf("country=GBR")>=0).toBe(true);

    });

  });
});