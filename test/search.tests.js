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

  });

});