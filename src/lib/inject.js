/*****************************************************************************
 * Inject
 *
 * @file    Once `run` has been executed you can inject additional deps
 */

module.exports = function(Amber) {

  /**
   * Applys deps to fn
   *
   * @param     {Array}      deps    An array of module names
   * @param     {Function}    fn     callback
   */
  return function inject(deps, fn) {
    var i = deps.length;
    while (--i >= 0) {
      deps[i] = Amber.module(deps[i]);
    }
    fn.apply(Amber, deps);
  };

}
