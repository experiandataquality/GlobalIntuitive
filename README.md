# Our Real Time Address API

[![GitHub version](https://badge.fury.io/gh/ExperianDataQuality%2FRealTimeAddress.svg)](http://badge.fury.io/gh/ExperianDataQuality%2FRealTimeAddress)
[![Dependency Status](https://david-dm.org/ExperianDataQuality/RealTimeAddress.svg)](https://david-dm.org/ExperianDataQuality/RealTimeAddress)
[![Dependency Status](https://david-dm.org/ExperianDataQuality/RealTimeAddress/dev-status.svg)](https://david-dm.org/ExperianDataQuality/RealTimeAddress#info=devDependencies)
[![Build Status](https://travis-ci.org/experiandataquality/RealTimeAddress.svg?branch=master)](https://travis-ci.org/experiandataquality/RealTimeAddress)

This repo contains sample code for integrating with Experian Data Quality's Address API. Currently available for GBR, USA, AUS, NZL and FRA.

Check out the [demo](https://www.edq.com/uk/products/address-validation/#interactive-demo) on our website.

## Usage

#### Prerequisites

- Include the Real Time Address API [JavaScript file](/dist/js/contact-data-services.min.js) in your form page.
- Have a token to hand (You would have received this from your Experian Data Quality account manager).

#### Integration

##### Tokens

> For the purpose of this sample code, the tokens for the live endpoint aren't hardcoded in source control and must be appended to the URL query string. For example: **http://experiandataquality.github.io/RealTimeAddress/?token=xyz**

To get a free trial, contact us via [edq.com](https://www.edq.com/uk/contact-us/)

*Header vs. query string*

To use a token and authenticate with the API you have two integration options.

1. Pass the `auth-token` through as a custom HTTP header.

2. Append the `auth-token` as a parameter in the query string when making the GET request.

If you are concerned about speed and want to reduce the latency as much as possible we recommend using the 2nd option and append the token to the query string.

If you were to pass it through to the API as a custom HTTP header then the browser would make an additional [pre-flight](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests) OPTIONS HTTP request before each search. Whilst ensuring your token isn't visible in any URLs it would slow it down slightly.

##### Options

Some customisable settings can be passed through to the API using an options object. By default you should at least pass through an `elements` object with the address field input and country list selectors.

```javascript
var options = {
	elements: {
		input: document.querySelector("input[name='address-input']"),
		countryList: document.querySelector("select")					
	}
};
```
Additional options that can be passed through include:

| Property name | Description | Default |
|------------|-------------|---------------|
| `language` | The ISO 2 digit language code | "en"|
| `placeholderText` | The placeholder text for the input | "Start typing an address"|
| `editAddressText` | The text for the 'edit address' link | "Edit address"|
| `searchAgainText` | The text for the 'search again' link | "Search again"|
| `useSpinner` | Whether to display a spinner while searching | false|

##### Invocation

Invoke a new instance by calling the `address` method on the Contact Data Services constructor.

`var address = new ContactDataServices.address(options);`

#### Events

After using instantiating a new instance the constructor returns an object that can be used to subscribe to events.

| Event name | Description | Example usage |
|------------|-------------|---------------|
| `pre-search` | Before a typedown search takes place | ```address.events.on("pre-search", function(term){ // ...  });```|
| `pre-picklist-create` | Before a picklist is created | ```address.events.on("pre-picklist-create", function(items){ // ...  });```|
| `post-picklist-create` | After a picklist has been created | ```address.events.on("post-picklist-create", function(){ // ... });```|
| `post-picklist-selection` | After a picklist item has been selected | ```address.events.on("post-picklist-selection", function(item){ // ... });```|
| `pre-formatting-search` | Just before the formatting search takes place | ```address.events.on("pre-formatting-search", function(url){ // ... });```|
| `post-formatting-search` | After the formatting search has returned a result | ```address.events.on("post-formatting-search", function(data){ // ... });```|
| `post-reset` | After the demo has been reset | ```address.events.on("post-reset", function(){ // ... });```|


## Development

While you're free to take the JavaScript from the [`dist`](/dist/js/contact-data-servicesjs) folder and use this in your website, should you want to contribute to this repo you'll need to compile the new version from the [`src`](/src/js/).

Make sure Node, Grunt and the Grunt CLI are installed.

- **Node** - https://nodejs.org/
- **Grunt and Grunt CLI** - With Node installed, open the Node.js Command Prompt as admin and `cd` into your local repository. Run `npm install -g grunt` to install Grunt followed by `npm install -g grunt-cli` to install the Grunt CLI.

Then:

0. Fork this repo (`https://github.com/ExperianDataQuality/RealTimeAddress`).
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
