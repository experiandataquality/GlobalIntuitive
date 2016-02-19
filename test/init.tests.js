describe("ContactDataServices", function() {

  describe("instance is disabled if", function() {

    it("token doesn't exist", function() {

      // Arrange
      var options = {};

      // Act
      var address = new ContactDataServices.address(options);

      // Assert
      expect(address.enabled).toBe(false);

    });

  });

  describe("instance is enabled if", function() {

    it("token exists", function() {

      // Arrange
      var options = {
        token: "1234567890"
      };

      // Act
      var address = new ContactDataServices.address(options);

      // Assert
      expect(address.enabled).toBe(true);

    });

  });

});