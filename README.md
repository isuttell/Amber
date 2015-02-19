Amber View System
======
A modular view system for building interactive javascript websites. Based upon the [Backbone.js](documentcloud.github.com/backbone/). AMD and CommonJS compatible.

[![Build Status](https://img.shields.io/travis/isuttell/Amber/develop.svg?style=flat)](https://travis-ci.org/isuttell/Amber)
[![Coverage Status](https://img.shields.io/coveralls/isuttell/Amber/develop.svg?style=flat)](https://coveralls.io/r/isuttell/Amber?branch=develop)
[![Codacy Badge](https://www.codacy.com/project/badge/a2eee285084c41a1aac829d580cb0044)](https://www.codacy.com/public/isuttell/Amber)
[![GitHub version](https://badge.fury.io/gh/isuttell%2FAmber.svg)](http://badge.fury.io/gh/isuttell%2FAmber)

## Requirements

* [jQuery](http://jquery.com/)

## Development

First run `npm install` to install the dev dependencies.

### Building
To generate a minified version of the library run `grunt build`

### Testing
To run the full gamut of tests, use `grunt test`

### Watch
The default `grunt` tasks watches for changes to Amber.js and any tests, then runs Jasmine, JSHint and JSCS.


## Documentation

### Amber.View

````
var ExampleView = Amber.View.Extend({
	/**
	 * This is the element the view will isolate it's scope to
	 *
	 * @type {Object}
	 */
	$el: $('.view-container'),

	/**
	 * Lodash Inline Template
	 *
	 * @type {String}
	 */
	template: $('.view-template').html(),

	/**
	 * The following events will be connected when the view
	 * is initilized
	 *
	 * @type {Object}
	 */
	events: {
		'click .button' : 'buttonEvent'
	},

	/**
	 * This event is called when a .button is clicked
	 *
	 * @param  {MouseEvent}   event
	 */
	buttonEvent: function(event) {
		console.log('.button has been clicked');
	},

	/**
	 * This function is called when a view is created
	 */
	initialize: function() {
		// Listen for a custom event
		this.on('after:render', function() {
			console.log('View rendered');
		});

		// This is a good place to render your views initial state
		this.render();

		// Trigger custom event
		this.trigger('after:render');

	}
})

// Create an instance of the view
var view = new ExampleView();
````


### Amber.Format

* `numberWithCommas(number)` - Adds commas to large numbers
* `stripTrailingZero(float)` - Strips trailing zero from floats, eg (5.0)
* `basicPluralize(word, count)` - Adds a 's' to `word` if count is over 1

````
	var commas = Amber.Format.numberWithCommas(1000); // Returns '1,000'
	var stripZero = Amber.Format.stripTrailingZero(5.0); // Returns '5'
	var plural = Amber.Format.basicPluralize('word', 5); // Returns 'words'
````

### Amber.Browser (User Agent Detection)

* `iOS`
* `iPhone`
* `iPad`
* `android`
* `blackberry`
* `iemobile`
* `firefox`
* `chrome`
* `safari`
* `ie`
* `mobile`

````
	if(Amber.Browser.mobile) {
		// Check to see if the user agent indicates a mobile device
	}
````

### Amber.Supports (Feature detection)

* `svg`
* `draganddrop`
* `touch`
* `cssanimations`
* `animationframes`

````
	if(Amber.Supports.svg) {
		// Returns true if we detected the browser supports SVGs
	}
````

### Amber.Preload

Image preloader with progress updates each time an image has loaded. The `progress` and `done` are optional. This can be used to preload images in the background or load images and display them after they have loaded.

````
	Amber.Preload(['image1.jpg', 'image2.jpg'], {
		progress: function(percent, current, total, lastImage){
			// This is run each time an image has loaded.
			// lastImage is the last image to be load and is an
			// instance of HTMLImageElement which can be manually
			// added to the DOM
		},
		done: function(images){
			// This runs once all of the images have been loaded
		}
	});
````

## To do

* Improve Documentation
* Remove Underscore/Lodash Dep.
