  /*****************************************************************************
   * Inject
   *
   * @file    Once `run` has been executed you can inject additional deps
   */

  Amber.inject = function(deps, fn) {
    var i = deps.length;
    while(--i >= 0) {
      deps[i] = Amber.$$modules[deps[i]];
    }
    fn.apply(Amber, deps);
  };
