(function(root, factory) {
  var Amber = function(){};

  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) { // amd
    define(['jquery', 'exports'], function($, exports) {
      return factory(root, new Amber(), $);
    });
  } else if (typeof module !== "undefined" && module.exports) { // Commonjs
    module.exports = factory(root, new Amber());
  } else {
    root.Amber = factory(root, new Amber(), root.jQuery || root.$); // window
  }
}(this, function(root, Amber, $) {

  // Commonjs
  if (typeof module !== "undefined" && module.exports) {
    $ = require('jquery');
  }

  /**
   * Safe an reference to jQuery
   *
   * @type    {jQuery}
   */
  Amber.$ = $;

  /**
   * App Version
   *
   * @type    {String}
   */
  Amber.VERSION = '0.6.0';
