  /*****************************************************************************
   * Run
   *
   * @file    Starts the application
   */

  /**
   * Loads any unloaded modules into the framework and acts as a starting point
   * for the application
   *
   * @public
   * @param     {Array}       deps        The names of any dependencies for the callback
   * @param     {Function}    callback    Optional callback
   */
  Amber.run = function(deps, callback) {
    if(!Amber._modules) {
      throw new Error("No new modules to load");
    }
    if(typeof deps === 'function') {
      callback = deps;
      deps = [];
    }
    var definitions = Amber._modules;
    delete Amber._modules;

    Amber.$$modules = Amber.$$modules || {};
    var modules = Amber.$$modules;

    var names = [];
    var i = definitions.length;

    // Put a check in here so we don't loop forever trying to find something
    // that does not exist
    var maxIterations = 1;

    // Get a list of new module names
    while(--i >= 0) {
      names.push(definitions[i].name);
      maxIterations += definitions[i].deps.length + 1;
    }
    // And add any existing module names
    for(i in Amber.$$modules) {
      names.push(i);
      maxIterations += 1;
    }

    var d;
    var add;
    i = -1;
    while(++i < definitions.length) {
      add = true;
      d = definitions[i].deps ? definitions[i].deps.length : 0;
      while(--d >= 0) {
        if(names.indexOf(definitions[i].deps[d]) === -1) {
          throw new Error("Unable to find module: " + definitions[i].deps[d]);
        } else if(typeof modules[definitions[i].deps[d]] !== 'undefined') {
          definitions[i].deps[d] = modules[definitions[i].deps[d]];
        } else if(typeof window[definitions[i].deps[d]] !== 'undefined') {
          definitions[i].deps[d] = window[definitions[i].deps[d]];
        } else {
          add = false;
        }
      }
      if(add && typeof definitions[i].extend !== 'undefined' && modules[definitions[i].extend]) {
        modules[definitions[i].name] = modules[definitions[i].extend].extend(definitions[i].fn.apply(Amber, definitions[i].deps));
      } else if(add && typeof definitions[i].extend === 'undefined') {
        modules[definitions[i].name] = definitions[i].fn.apply(Amber, definitions[i].deps);
      } else {
        definitions.push(definitions[i]);
      }
      definitions[i] = void 0;

      if(i >= maxIterations) {
        throw new Error("Unable to resolve dependencies");
      }
    }

    if(typeof callback === 'function') {
      Amber.inject(deps, callback);
    }
  };
  Amber.run();
