// Default settings
ContactDataServices.defaults = {
	input: { placeholderText: "Start typing an address...", applyFocus: false },
	formattedAddressContainer: { showHeading: false, headingType: "h3", validatedHeadingText: "Validated address", manualHeadingText: "Manual address entered"  },
	searchAgain: { visible: true, text: "Search again"},
	useAddressEnteredText: "<em>Enter address manually</em>",
	useSpinner: false,
	language: "en",
	addressLineLabels: [
		"addressLine1",
		"addressLine2",
		"addressLine3",
		"locality",
		"province",
		"postalCode",
		"country"
	]
};

// Create configuration by merging custom and default options
ContactDataServices.mergeDefaultOptions = function(customOptions){
	var instance = customOptions || {};

	instance.enabled = true;
	instance.language = instance.language || ContactDataServices.defaults.language;
	instance.useSpinner = instance.useSpinner || ContactDataServices.defaults.useSpinner;
	instance.lastSearchTerm = "";
	instance.currentSearchTerm = "";
	instance.lastCountryCode = "";
	instance.currentCountryCode = "";
	instance.currentSearchUrl = "";
	instance.currentFormatUrl = "";
	instance.applyFocus = (typeof instance.applyFocus !== "undefined") ? instance.applyFocus : ContactDataServices.defaults.input.applyFocus;
	instance.placeholderText = instance.placeholderText || ContactDataServices.defaults.input.placeholderText;
	instance.searchAgain = instance.searchAgain || {};
	instance.searchAgain.visible = (typeof instance.searchAgain.visible !== "undefined") ? instance.searchAgain.visible : ContactDataServices.defaults.searchAgain.visible;
	instance.searchAgain.text = instance.searchAgain.text || ContactDataServices.defaults.searchAgain.text;
	instance.formattedAddressContainer = instance.formattedAddressContainer || ContactDataServices.defaults.formattedAddressContainer;
	instance.formattedAddressContainer.showHeading = (typeof instance.formattedAddressContainer.showHeading !== "undefined") ? instance.formattedAddressContainer.showHeading : ContactDataServices.defaults.formattedAddressContainer.showHeading;
	instance.formattedAddressContainer.headingType = instance.formattedAddressContainer.headingType || ContactDataServices.defaults.formattedAddressContainer.headingType;
	instance.formattedAddressContainer.validatedHeadingText = instance.formattedAddressContainer.validatedHeadingText || ContactDataServices.defaults.formattedAddressContainer.validatedHeadingText;
	instance.formattedAddressContainer.manualHeadingText = instance.formattedAddressContainer.manualHeadingText || ContactDataServices.defaults.formattedAddressContainer.manualHeadingText;
	instance.elements = instance.elements || {};

	return instance;
};
