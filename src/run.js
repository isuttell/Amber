  /*****************************************************************************
   * Run
   *
   * @file    Starts the application
   */

  /**
   * Gets a list of all the modules names that have already been found. If an
   * module requires something that can't be found in this list then we can't
   * resolve it.
   *
   * @param     {Array}     definitions    Modules to be applied
   * @param     {Object}    modules        Modules already applied
   *
   * @return    {Array}
   */
  var getNames = function(definitions, modules) {
    var names = [];
    var i = definitions.length;
    while(--i >= 0) {
      names.push(definitions[i].name);
    }
    // And add any existing module names
    for(i in modules) {
      names.push(i);
    }
    return names;
  };

  /**
   * The module factory is initialized with a list of names and modules. Then
   * the create method takes a module definition and looks to see if the
   * definitions dependencies are ready yet. If they are we pass the completed
   * definition or falsey
   *
   * @private
   * @param    {Array}     names      Used to check to see if a module exists at all
   * @param    {Object}    modules    Completed modules
   */
  var ModuleFactory = function(names, modules) {

    /**
     * Loop through each definition's arguments to check to see if they have
     * already been applied or not. If not then we add it back into the loop
     * and try again later
     *
     * @param     {Object}    definition    Object pulled from `Amber.define`
     *
     * @return    {Object|Boolean}          Either completed definition or falsey
     */
    this.create = function(definition) {
      var add = true;

      var d = definition.deps ? definition.deps.length : 0;
      while(--d >= 0) {
        if(names.indexOf(definition.deps[d]) === -1) {
          throw new Error("Unable to find module: " + definition.deps[d]);
        } else if(typeof modules[definition.deps[d]] !== 'undefined') {
          definition.deps[d] = modules[definition.deps[d]];
        } else if(typeof window[definition.deps[d]] !== 'undefined') {
          definition.deps[d] = window[definition.deps[d]];
        } else {
          add = false;
        }
      }

      if(add){
        return definition;
      } else {
        return false;
      }
    };
  };

  /**
   * Loads any unloaded modules into the framework and acts as a starting point
   * for the application
   *
   * @public
   * @param     {Array}       deps        The names of any dependencies for the callback
   * @param     {Function}    callback    Optional callback
   */
  Amber.run = function(deps, callback) {
    // Optional callback
    if(typeof deps === 'function') {
      callback = deps;
      deps = [];
    }

    // Save a copy of any new definitions and remove them from the queue
    var definitions = Amber._modules;
    delete Amber._modules;

    // Ensure the module directory exists
    Amber.$$modules = Amber.$$modules || {};
    var modules = Amber.$$modules;

    // Save a list of all defined modules so we can check to see if new modules
    // are requiring modules we can actually find
    var names = getNames(definitions, modules);

    // Put a check in here so we don't loop forever trying to find something
    // that does not exist
    var maxIterations = names.length * names.length;

    // Start the factory which setups up each definition so we can apply it
    var factory = new ModuleFactory(names, modules);

    // Loop through each new definition
    var i = -1;
    while(++i < definitions.length) {
      // Check to see if the definition is ready to be applied
      var definition = factory.create(definitions[i]);

      if(definition && typeof definition.extend !== 'undefined' && modules[definition.extend]) {
        // If the module is uses the `extend` module and defines then we apply it here
        modules[definition.name] = modules[definition.extend].extend(definition.fn.apply(Amber, definition.deps));
      } else if(definition && typeof definition.extend === 'undefined') {
        // If all of the modules dependencies are found then we apply it
        modules[definition.name] = definition.fn.apply(Amber, definition.deps);
      } else {
        // Otherwise we send it back to check later
        definitions.push(definitions[i]);
      }

      // Set it to undefined so we don't store multiple copyies in memory
      definitions[i] = void 0;

      // Ensure we don't hit an infinite loop if we can't resolve things
      if(i >= maxIterations) {
        throw new Error("Unable to resolve dependencies");
      }
    }

    // optional Callback
    if(typeof callback === 'function') {
      Amber.inject(deps, callback);
    }
  };

  // Resolve internal dependencies before any user defined deps
  Amber.run();
