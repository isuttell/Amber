  /*****************************************************************************
   * Define
   *
   * @file    Module definition functions
   */

  Amber.define = function(name, deps, fn, extend) {
    // Optional args
    if({}.toString.call(deps) === '[object Function]'){
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

  Amber.View = function(name, deps, fn) {
    // Optional args
    if({}.toString.call(deps) === '[object Function]'){
      fn = deps;
      deps = [];
    }
    Amber.define(name, deps, fn, 'View');
  };
