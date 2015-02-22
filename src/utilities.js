  /*****************************************************************************
   * Utility Functions
   *
   * @file    Useful functions
   */

  Amber.define('Utilities', function(){

    /**
     * Checks to see if an object is a specific type
     *
     * @param     {Mixed}     obj
     * @param     {String}    type
     *
     * @return    {Boolean}
     */
    var isType = function(obj, type) {
      return {}.toString.call(obj) === '[object ' + type + ']';
    };

    /**
     * Checks to see if a var is an object
     *
     * @param  {Object}  obj variable to test
     *
     * @return {Boolean}
     */
    var isObject = function(obj) {
      return isType(obj, 'Object');
    };

    /**
     * Checks to see if a var is a string
     *
     * @param  {String}  str var to check
     *
     * @return {Boolean}     [description]
     */
    var isString = function(str) {
      return isType(str, 'String');
    };

    /**
     * Checks to see if a var is a string
     *
     * @param  {String}  str var to check
     *
     * @return {Boolean}     [description]
     */
    var isFunction = function(fn) {
      return isType(fn, 'Function');
    };

    /**
     * Checks to see if a var is a function or object
     *
     * @param  {Mixed}  obj  var to check
     *
     * @return {Boolean}
     */
    var isIterable = function(obj) {
      return isType(obj, 'Object') || isType(obj, 'Function');
    };

    /**
     * Runs a function once
     *
     * @param  {Function} fn
     *
     * @return {Mixed}
     */
    var runOnce = function(fn) {
      var ran;
      var result;

      if (!isFunction(fn)) {
        throw new Error('fn isn\'t a function');
      }

      return function() {
        if (ran) {
          return result;
        }
        ran = true;

        result = fn.apply(this, arguments);

        fn = null;
        return result;
      };
    };

    /**
     * Gets a variable or calls a function depending on what it finds
     *
     * @param  {Object}    obj     Object to look in
     * @param  {String}    name    Object key to get
     * @param  {Mixed}     context `this` context to Apply
     * @param  {Mixed...}  args    Additional arguments to pass to function context
     *
     * @return {Mixed}
     */
    var results = function(obj, name, context) {
      if (isFunction(obj[name])) {
        var args = Array.prototype.slice.call(arguments).slice(3);
        return obj[name].apply(context || this, args);
      } else if (isObject(obj)) {
        return obj[name];
      } else {
        return obj;
      }
    };

    /**
     * Extends multiple objects
     *
     * @param     {Object}    object     input
     * @param     {...Object}    source    defaults
     *
     * @return    {Object}
     */
    var assign = function(object) {
      // This is stores the resulting object
      var result = object;

      // If it's not an object/function bail
      if (!isIterable(result)) {
        return result;
      }

      var argsLength = arguments.length;

      // Start this on the section argument
      var argIndex = 0;

      // Loop through the arguments
      while (++argIndex < argsLength) {
        var iterable = arguments[argIndex];
        if (isIterable(iterable)) {
          var objIndex = -1;
          var objProps = keys(iterable);
          var objLength = objProps.length;

          // Loop through each argument
          while (++objIndex < objLength) {
            var index = objProps[objIndex];
            result[index] = iterable[index];
          }
        }
      }

      return result;
    };

    /**
     * Returns the keys/indexs from an object
     *
     * @param     {Object}    object
     *
     * @return    {Array}
     */
    var keys = function(obj) {
      var result = [];
      var index;
      if (!isObject(obj)) {
        return obj;
      }

      for (index in obj) {
        if (obj.hasOwnProperty(index)) {
          result.push(index);
        }
      }
      return result;
    };

    /**
     * Returns the values from an object
     *
     * @param     {Object}    object
     *
     * @return    {Array}
     */
    var values = function(obj) {
      var result = [];
      var index;
      if (!isObject(obj)) {
        return obj;
      }

      for (index in obj) {
        if (obj.hasOwnProperty(index)) {
          result.push(obj[index]);
        }
      }
      return result;
    };

    /**
     * Checks to see if an object has a property
     *
     * @param     {Object}     obj
     * @param     {String}     prop
     * @return    {Boolean}
     */
    var has = function(obj, prop) {
      return !!obj[prop];
    };

    /**
     * Interal ID counter;
     *
     * @private
     * @type    {Number}
     */
    var _uniqueId = 0;

    /**
     * Produces a unique id
     *
     * @param     {String}    name    optional prefix
     * @return    {String}
     */
    var uniqueId = function(name) {
      return (name || 'id') + (++_uniqueId);
    };

    return {
      uniqueId: uniqueId,
      has: has,
      keys: keys,
      values: values,
      isObject: isObject,
      isString: isString,
      isFunction: isFunction,
      isIterable: isIterable,
      runOnce: runOnce,
      results: results,
      assign: assign
    };

  });