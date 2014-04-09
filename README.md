Amber
======
A modular read only system for building complex javascript applications. Based heavily upon the [Backbone.js](documentcloud.github.com/backbone/).

[![Build Status](https://travis-ci.org/isuttell/Amber.png?branch=master)](https://travis-ci.org/isuttell/Amber)


Goals
------
* Provide a simple and modular way to organize code on complex projects
* Provide an easy way to animate complex interfaces
* Keep it lean and remove as many dependencies on third party libraries as possible


Requirements
------
* [Lo-Dash](lodash.com)
* [jQuery](http://jquery.com/)


Building
--------
To generate a minified version of the library run the following command:

````
grunt build
````


Testing
--------
To run the full gamut of tests, use the following command:

````
grunt test
````

Documentation
======


Amber.Format
------
Basic formating functions

* `numberWithCommas(number)` - Adds commas to large numbers
* `stripTrailingZero(float)` - Strips trailing zero from floats, eg (5.0)
* `basicPluralize(word, count)` - Adds a 's' to `word` if count is over 1

````
	var commas = Amber.Format.numberWithCommas(1000); // Returns '1,000'
	var stripZero = Amber.Format.stripTrailingZero(5.0); // Returns '5'
	var plural = Amber.Format.basicPluralize('word', 5); // Returns 'words'
````


Amber.Browser
------
User Agent Detection

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


Amber.Supports
------
Feature detection

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


Amber.scrollTo
------
Scroll to a specific element on a page

````
	Amber.scrollTo('#target', {
		offset: 0, // Subtract this from the offset().top of the '#target'
		duration: 500, // The length of the animation
		easing: 'easeInOutExpo' // Ease function
	});
````

Amber.Preload
------
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