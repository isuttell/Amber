/**
 * Setup the the framework as a singleton
 *
 * @type    {Object}
 */

'use strict';

var Amber = {};

/**
 * Save the version information inside the plugin for future debugging
 *
 * @type    {String}
 */
Amber.version = '0.6.0';

/**
 * Require Depedency Injection System
 */
Amber.define = require('./lib/define')(Amber);
Amber.inject = require('./lib/inject')(Amber);
Amber.module = require('./lib/module')(Amber);
Amber.run = require('./lib/run')(Amber);
Amber.$ = require('jquery');

/**
 * Define aliases
 */
Amber.View = require('./lib/view')(Amber);

/**
 * Built in modules. These are available as dependencies to any definition
 *
 * @type    {Object}
 */
Amber.$$modules = {
  'jQuery' : require('jquery'),
  '$browser': require('./modules/browser'),
  '$utilities' : require('./modules/utilities'),
  '$supports' : require('./modules/supports'),
  '$view' : require('./modules/view'),
  '$window' : require('./modules/window')
};

module.exports = Amber;
