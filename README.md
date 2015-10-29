# Contact Data Services

[![GitHub version](https://badge.fury.io/gh/ExperianDataQuality%2Fcontactdataservices.svg)](http://badge.fury.io/gh/ExperianDataQuality%2Fcontactdataservices)
[![Dependency Status](https://david-dm.org/ExperianDataQuality/contactdataservices.svg)](https://david-dm.org/ExperianDataQuality/contactdataservices)
[![Dependency Status](https://david-dm.org/ExperianDataQuality/contactdataservices/dev-status.svg)](https://david-dm.org/ExperianDataQuality/contactdataservices#info=devDependencies)
[![Build Status](https://travis-ci.org/experiandataquality/contactdataservices.svg?branch=master)](https://travis-ci.org/experiandataquality/contactdataservices)

This repo contains sample code for integrating with Experian Data Quality's Contact Data Services. Currently set up for typedown address searching for GBR, USA, AUS, NZL and FRA.

## Usage

#### Prerequisites

- Include the Contact Data Services [JavaScript file](https://github.com/experiandataquality/contactdataservices/blob/master/dist/js/contact-data-services.min.js) in your form page.
- Have a token to hand (You would have received this from your Experian Data Quality account manager).

#### Integration

> For the purpose of this sample code, the tokens for the live endpoint aren't hardcoded in source control and must be appended to the URL query string. For example: **http://localhost/?token=xyz**

Some customisable settings can be passed through to the API using an options object. By default you should at least pass through an `elements` object with the address field input and country list selectors.

```
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
| `placeholderText` | The placeholder text for the input | "Start typing an address"|
| `editAddressText` | The text for the 'edit address' link | "Edit address"|
| `searchAgainText` | The text for the 'search again' link | "Search again"|

##### Invocation

Invoke a new instance by calling the `address` method on the Contact Data Services constructor.

`var address = new ContactDataServices.address(options);`

#### Events

After using instantiating a new instance the constructor returns an object that can be used to subscribe to events.

| Event name | Description | Example usage |
|------------|-------------|---------------|
| `pre-formatting-search` | Just before the formatting search takes place | ```address.events.on("pre-formatting-search", function(){ // ... some code });```|
| `post-formatting-search` | After the formatting search has returned a result | ```address.events.on("post-formatting-search", function(){ // ... some code });```|


## Development

Make sure Node and the Grunt CLI are both installed.

- **Node** - https://nodejs.org/
- **Grunt CLI** - with Node installed, `cd` into your local repository and run `npm install -g grunt-cli`

Then:

0. Fork this repo (`https://github.com/ExperianDataQuality/contactdataservices`).
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