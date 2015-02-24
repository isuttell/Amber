/*****************************************************************************
 * Get a Module
 */

'use strict';

module.exports = function(Amber) {

  /**
   * Module getter
   *
   * @param     {String}    name
   * @return    {Mixed}
   */
  return function module(name) {
    return Amber.$$modules[name];
  };
};
