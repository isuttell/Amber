/*****************************************************************************
 * Define
 *
 * @file    Module definition functions
 */

'use strict';

var _ = require('../modules/utilities');

module.exports = function(Amber) {

  return function define(name, deps, fn, extend) {
    // Optional args
    if(_.isFunction(deps)){
      fn = deps;
      deps = [];
    }

    // Make sure it exists
    Amber._modules = Amber._modules || [];

    // Save
    Amber._modules.push({
      extend: extend,
      name: name,
      deps: deps,
      fn: fn
    });
  };

};
