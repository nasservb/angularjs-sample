/**
 * To run locally
 *    export MINDS_E2E_LOCAL=TRUE
 *   to select a browser run
 *       export MINDS_E2E_BROWSERS=Chrome (firefox, safari)
 *
 * To run on Sauce Labs
 *    export MINDS_E2E_BASE=https://new.minds.com/
 *    export MINDS_E2E_LOCAL=FALSE
 */

require('babel/register');

var BASE_URL = process.env.MINDS_E2E_BASE ? process.env.MINDS_E2E_BASE : 'http://afsaran.ir/';
var BROWSERS = require('./sauce.conf');
var aliases = BROWSERS.aliases;

var _browsers = process.env.MINDS_E2E_BROWSERS ? process.env.MINDS_E2E_BROWSERS : ['CHROME'];

var config = {
	baseUrl: BASE_URL,

	onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

		browser.ignoreSynchronization = true;
    //browser.driver.get(BASE_URL);
		if(BASE_URL == 'http://afsaran.ir'){
    	browser.manage().addCookie('beta', 'angular2', '/', 'iTimche.net');
		  browser.driver.get(BASE_URL);
    }
	},
	specs: [
		'./tests/e2e/helpers.js',
		//'./tests/e2e/components/signupModal.js',
		'./tests/e2e/*.js',
		'./tests/e2e/**/*.js'
	],
	exclude: [],
	capabilities: {
		browserName: _browsers
	},
	framework: 'jasmine2',
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  useAllAngular2AppRoots: true
};

if(process.env.MINDS_E2E_LOCAL == 'TRUE'){
	config.directConnect =  true;
} else {
	config.sauceUser =  process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
	config.multiCapabilities = aliases[_browsers].map(function(alias){
	    console.log('testing: ' + BROWSERS.customLaunchers[alias].browserName);
	    var b = BROWSERS.customLaunchers[alias];
	    b.name = BROWSERS.customLaunchers[alias].browserName + ' (' + b.version + ') test';
	    return b;
	  });
}

exports.config = config;
