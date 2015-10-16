# Contact Data Services

[![GitHub version](https://badge.fury.io/gh/AndyWhite87%2Fcontactdataservices.svg)](http://badge.fury.io/gh/AndyWhite87%2Fcontactdataservices)
[![Dependency Status](https://david-dm.org/AndyWhite87/contactdataservices.svg)](https://david-dm.org/AndyWhite87/contactdataservices)
[![Dependency Status](https://david-dm.org/AndyWhite87/contactdataservices/dev-status.svg)](https://david-dm.org/AndyWhite87/contactdataservices#info=devDependencies)
[![Build Status](https://travis-ci.org/AndyWhite87/contactdataservices.svg?branch=master)](https://travis-ci.org/AndyWhite87/contactdataservices)
[![Coverage Status](https://coveralls.io/repos/AndyWhite87/contactdataservices/badge.svg?branch=master&service=github)](https://coveralls.io/github/AndyWhite87/contactdataservices?branch=master)

## Development

Make sure Node and the Grunt CLI are both installed.

- **Node** - https://nodejs.org/
- **Grunt CLI** - with Node installed, `cd` into your local repository and run `npm install -g grunt-cli`

Then:

0. Fork this repo (`https://github.com/TeamArachne/contactdataservices`).
0. Run `npm install` to get the configured Grunt packages.
0. Push your changes and, when ready, make a pull request for them to be added to master.

### Grunt tasks

Grunt tasks are run from the command line in the same way as Node commands. They are configured in `gruntfile.js`.

##### grunt watch

Begins watching `gruntfile.js` and all files in the `src/js` and `test` folders. When any of them change, JSHint will run on the same files, then any Jasmine specs in the `test` folder will run. JSHint and Jasmine results will be output to the console each time.

It's best to leave this running in its own window, as you won't be able to run other tasks from it while watch is running.

##### grunt test

Runs JSHint on `gruntfile.js` and all files in the `src/js` and `test` folders, then runs any Jasmine specs in the `test` folder and records code coverage. Code coverage results are displayed in the command window.

Also runs the Coveralls task, which only succeeds when running in Travis CI.

##### grunt build

Runs JSHint, Jasmine and code coverage as above, then concatenates and uglifies files as configured in gruntfile.js. Built files appear in a root folder named dist.

### Travis CI

Travis is an online CI environment that will build your project each time you push commits to GitHub. It's configured to run automatically in `gruntfile.js`.

To set it up for your own fork, go to https://travis-ci.org and sign in with your GitHub account. Then follow the steps to enable Travis for your repo.

Now each time you push to GitHub, Travis will build the project and run any Jasmine tests. Pretty sweet. It also passes the code coverage results to Coveralls.

### Coveralls

Coveralls is an online code coverage explorer. This project has been configured to pass code coverage data to Coveralls, which makes it very easy to see which areas of code are covered by unit tests and where attention needs to be directed.

To set it up for your own fork, go to https://coveralls.io/ and sign in with your GitHub account. Then follow the steps to enable Coveralls for your repo.

Now each time a build completes in Travis CI (see above), code coverage will be analysed by Coveralls. You can dig into the results for each file and see a nice line-by-line representation of which code areas are covered by unit tests and which ones need more attention.
