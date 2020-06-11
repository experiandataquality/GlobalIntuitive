# Experian Address Validation

[![GitHub version](https://badge.fury.io/gh/experianplc%2FExperian-Address-Validation.svg)](http://badge.fury.io/gh/experianplc%2FExperian-Address-Validation)
[![Build Status](https://travis-ci.org/experianplc%2FExperian-Address-Validation.svg?branch=master)](https://travis-ci.org/experianplc%2FExperian-Address-Validation)

This repo contains sample code for integrating with Experian's Address Validation API. Currently available for over 235 countries and territories.

Check out the [demo](https://www.experian.co.uk/business/data-management/data-validation/address-validation/) on our website.

## Usage

#### Prerequisites

If you want to use the code for your integration *as-is*, without modifying it, then you only need the items below.

If you need to *edit* the code, then jump to the [Development](#development) section.

- Include the Global Intuitive [JavaScript file](/dist/js/contact-data-services.min.js) in your form page.
- Have a token to hand (You would have received this from your Experian account manager).

#### Integration

##### Options

After embedding the script tag in your webpage you can customise it by passing settings through to the API using an options object. By default you should at least pass through an `elements` object with the address field input and country list selectors.

As well as this, you should also always provide your token.

```javascript
var options = {
    token: "INSERT_TOKEN",
    elements: {
        input: document.querySelector("input[name='address-input']"),
        countryList: document.querySelector("select")					
    }
};
```

If you have your own return fields that you want a final address pasted to, you need to specify these in the `elements` object too.

Additional options that can be passed through include:

| Property name | Description | Default |
|------------|-------------|---------------|
| `token` | Your authentication token. Recommended. | |
| `location` | Latitude and Longitude values in a string separated by a comma (e.g. "40.52,-73.93") | null |
| `language` | The ISO 2 digit language code | "en"|
| `input.placeholderText` | The placeholder text for the input | "Start typing an address"|
| `input.applyFocus` | Whether to apply focus to the search field | true|
| `searchAgain.visible` | Whether the 'search again' link is shown | true|
| `searchAgain.text` | The text for the 'search again' link | "Search again"|
| `formattedAddressContainer.showHeading` | Whether to show a "Validated address" heading | false|
| `formattedAddressContainer.headingType` | If a heading is shown, what HTML element to use | H3|
| `formattedAddressContainer.validatedHeadingText` | Heading text for validated addresses | "Validated address"|
| `formattedAddressContainer.manualHeadingText` | Heading text if address entered manually | "Manual address entered"|
| `useSpinner` | Whether to display a spinner while searching | false|
| `addressLineLabels` | An array of 7 labels for the form fields | ["addressLine1", "addressLine2", "addressLine3", "locality", "province", "postalCode", "country"] |

##### Country list

The default sample page contains the full list of supported countries. This list should be amended to include only the countries that your integration supports. A full list of available countries and their ISO codes can also be found with our [API documentation](https://www.edq.com/documentation/apis/address-validate/experian-address-validation/#supported-countries-2).

##### Tokens

> For the purpose of this sample code, the tokens for the live endpoint aren't hardcoded in source control and must be appended to the query as a header parameter.

To get your token and a free trial, contact us via [www.experian.co.uk/business/enquire](https://www.experian.co.uk/business/enquire)

As mentioned above in [Options](/#options) you should pass your token through as a setting. The sample page in this repo appends it to the query string to avoid hardcoding a token in source control.

##### Invocation

Invoke a new instance by calling the `address` method on the Contact Data Services constructor.

`var address = new ContactDataServices.address(options);`

#### Events

After instantiating a new instance the constructor returns an object that can be used to subscribe to events.

| Event name | Description | Example usage |
|------------|-------------|---------------|
| `pre-search` | Before a typedown search takes place | ```address.events.on("pre-search", function(term){ // ...  });```|
| `pre-picklist-create` | Before a picklist is created | ```address.events.on("pre-picklist-create", function(items){ // ...  });```|
| `post-picklist-create` | After a picklist has been created | ```address.events.on("post-picklist-create", function(){ // ... });```|
| `post-picklist-selection` | After a picklist item has been selected | ```address.events.on("post-picklist-selection", function(item){ // ... });```|
| `pre-formatting-search` | Just before the formatting search takes place | ```address.events.on("pre-formatting-search", function(url){ // ... });```|
| `post-formatting-search` | After the formatting search has returned a result | ```address.events.on("post-formatting-search", function(data){ // ... });```|
| `post-reset` | After the demo has been reset | ```address.events.on("post-reset", function(){ // ... });```|
| `request-timeout` | A timeout occurred during the XMLHttpRequest | ```address.events.on("request-timeout", function(xhr){ // ... });```|
| `request-error` | A generic error occurred initiating the XMLHttpRequest | ```address.events.on("request-error", function(xhr){ // ... });```|
| `request-error-400` | A 400 Bad Request error occurred | ```address.events.on("request-error-400", function(xhr){ // ... });```|
| `request-error-401` | A 401 Unauthorized error occurred (invalid token) | ```address.events.on("request-error-401", function(xhr){ // ... });```|
| `request-error-403` | A 403 Forbidden error occurred | ```address.events.on("request-error-403", function(xhr){ // ... });```|
| `request-error-404` | A 404 Not Found error occurred | ```address.events.on("request-error-404", function(xhr){ // ... });```|

#### Customising labels

By default the API returns the formatted address using a global 7-line layout. This means that the field labels for every country are all the same. These are:

* address_line_1
* address_line_2
* address_line_3
* locality
* region
* postal_code
* country

However, in your integration you might wish to change "locality" to "city" or "postalCode" to "post code", for example.

1. Access the [_translations.js file](/src/js/_translations.js)

2. Add the localised labels to the existing object, following the `language:country:property` pattern. For example:

```JavaScript
en: {
    gbr: {
      locality: "Town/City",
      region: "County",
      postal_code: "Post code"
    }
}
```

Any property you don't override will continue to use the default label.

NB. You can change the language by passing this setting through, as described in [Options](/#options).

#### Returning results

The API returns the formatted address in json format as **7 lines**.

If you **have your own** fields to paste the result to, you must tell the API about your fields.
This is done when integrating the API and specifying your elements. As well as specifying the input and country field, you'd specify your "result" fields. e.g.

```
var countryMap = {"GB": "GBR","AF": "AFG","AX": "ALA","AL": "ALB","DZ": "DZA"};

var options = {
    elements: {
        input: document.querySelector("input[name='address-input']"),
        countryList: document.querySelector("select"),
        countryCodeMapping : countryMap,
        address_line_1: document.querySelector("input[name='address_line_1']"),
        address_line_2: document.querySelector("input[name='address_line_2']"),
        address_line_3: document.querySelector("input[name='address_line_2']"),
        locality: document.querySelector("input[name='locality']"),
        region: document.querySelector("input[name='locality']"),
        postal_code: document.querySelector("input[name='postal_code']")
        country: document.querySelector("input[name='country']")
    }
};
```

A note on the country list: If you need to pass a value for the Datasets parameter to the API in order to specify a non-default dataset for a certain country, the value of the option in the country list should be in the format "{country ISO code};{dataset name}". Please see the [API Reference](https://www.edq.com/documentation/apis/address-validate/experian-address-validation/) for more details on the Datasets API parameter.

Notice how you can return multiple address lines to the same form field.

If you **don't** have your own fields, this sample code creates a new form field for each of the address lines and sets the value accordingly. These form fields are created for you and don't need to be specified in advance.

The form fields are wrapped in a `div` with a class name of "formatted-address".

The `name` attribute for each field is the same as the label discussed in [Customising labels](/#customising-labels). That is, either the default label returned by the API, or a custom key if it's overridden.

#### Components and Metadata

In addition to the 7 address lines. A format request also returns an array of objects containing the individual components that make up the address and a metadata object. Currently the metadata object will return Delivery Point Validation (DPV) information for USA searches.

Components and Metadata are not designed to be returned to the user and instead should be stored separately. This will be specific to your requirements and is not included in the sample code.

More information can be found in the [documentation](https://www.edq.com/documentation/apis/address-validate/experian-address-validation/).

## Development

While you're free to take the JavaScript from the [`dist`](/dist/js/contact-data-services.js) folder and use this in your website, should you want to contribute to this repo you'll need to compile the new version from the [`src`](/src/js/).

Make sure Node, Grunt and the Grunt CLI are installed.

- **Node** - https://nodejs.org/
- **Grunt and Grunt CLI** - With Node installed, open the Node.js Command Prompt as admin and `cd` into your local repository. Run `npm install -g grunt` to install Grunt followed by `npm install -g grunt-cli` to install the Grunt CLI.

Then:

0. Fork this repo (`https://github.com/experianplc/Experian-Address-Validation`).
0. Run `npm install` to get the configured Grunt packages.
0. Check the Grunt tasks to ensure your changes are built.
0. Push your changes and, when ready, make a pull request for them to be added to master.

#### Grunt tasks

Grunt tasks are run from the command line in the same way as Node commands. They are configured in `gruntfile.js`.

##### grunt watch

Begins watching `gruntfile.js` and all files in the `src/js` and `test` folders. When any of them change, JSHint will run on the same files, then any Jasmine specs in the `test` folder will run. JSHint and Jasmine results will be output to the console each time.

It's best to leave this running in its own window, as you won't be able to run other tasks from it while watch is running.

##### grunt test

Runs JSHint on `gruntfile.js` and all files in the `src/js` and `test` folders, then runs any Jasmine specs in the `test` folder and records code coverage. Code coverage results are displayed in the command window.

##### grunt build

Runs JSHint, Jasmine and code coverage as above, then concatenates and uglifies files as configured in gruntfile.js. Built files appear in a root folder named dist.

#### Travis CI

Travis is an online CI environment that will build your project each time you push commits to GitHub. It's configured to run automatically in `gruntfile.js`.

To set it up for your own fork, go to https://travis-ci.org and sign in with your GitHub account. Then follow the steps to enable Travis for your repo.

Now each time you push to GitHub, Travis will build the project and run any Jasmine tests. Pretty sweet.

## Support

At the time of writing, this sample code is currently supported in Chrome, Firefox and Safari latest, as well as IE 10.
