/*****************************************************************************
 * View
 *
 * @alias
 * @file    Alias to define a module that extends a View
 */
'use strict';

var _ = require('../modules/utilities');

module.exports = function(Amber) {

  return function View(name, deps, fn) {
    // Optional args
    if(_.isFunction(deps)){
      fn = deps;
      deps = [];
    }

    Amber.define(name, deps, fn, '$view');
  };

};
