/*****************************************************************************
 * Utility Functions
 *
 * @file    Useful functions
 */

'use strict';

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
 * Checks to see if a var is undefined
 *
 * @param  {Mixed}  obj  var to check
 *
 * @return {Boolean}
 */
var isUndefined = function(obj) {
  return isType(obj, 'Undefined');
};

/**
 * Runs a function once
 *
 * @param  {Function} fn
 *
 * @return {Mixed}
 */
var runOnce = function(fn, ctx) {
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

    result = fn.apply(ctx || this, arguments);

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


/**
 * Check to see if an image is already loaded
 * http://stackoverflow.com/a/1977898/2489839
 *
 * @param  {Object}  img Image Object
 * @return {Boolean}
 */
var isImageLoaded = function(img) {
  // During the onload event, IE correctly identifies any images that
  // weren’t downloaded as not complete. Others should too. Gecko-based
  // browsers act like NS4 in that they report this incorrectly.
  if (!img.complete) {
    return false;
  }

  // However, they do have two very useful properties: naturalWidth and
  // naturalHeight. These give the true size of the image. If it failed
  // to load, either of these should be zero.
  if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
    return false;
  }

  // No other way of checking: assume it’s ok.
  return true;
};

/**
 * Public API
 *
 * @public
 * @type    {Object}
 */
module.exports = {
  uniqueId: uniqueId,
  has: has,
  keys: keys,
  values: values,
  isUndefined: isUndefined,
  isObject: isObject,
  isString: isString,
  isFunction: isFunction,
  isIterable: isIterable,
  runOnce: runOnce,
  results: results,
  assign: assign,
  isImageLoaded: isImageLoaded
};
