/*****************************************************************************
 * Extend
 *
 * @file    Allows a function to be extended such as View
 */

'use strict';

var _ = require('../modules/utilities');

var extend = function(protoProps, staticProps) {

  var parent = this;
  var child = function() {
    return parent.apply(this, arguments);
  };

  // Add static properties to the constructor function, if supplied.
  _.assign(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function() {
    this.constructor = child;
  };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) {
    _.assign(child.prototype, protoProps);
  }

  child.extend = extend;

  return child;
};

module.exports = extend;
