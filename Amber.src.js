(function(root, factory) {
  var Amber = function(){};

  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) { // amd
    define(['jquery', 'exports'], function($, exports) {
      return factory(root, new Amber(), $);
    });
  } else if (typeof module !== "undefined" && module.exports) { // Commonjs
    module.exports = factory(root, new Amber());
  } else {
    root.Amber = factory(root, new Amber(), root.jQuery || root.$); // window
  }
}(this, function(root, Amber, $) {

  // Commonjs
  if (typeof module !== "undefined" && module.exports) {
    $ = require('jquery');
  }

  /**
   * Safe an reference to jQuery
   *
   * @type    {jQuery}
   */
  Amber.$ = $;

  /**
   * App Version
   *
   * @type    {String}
   */
  Amber.VERSION = '0.6.0';

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

  /*****************************************************************************
   * Utility Functions
   *
   * @file    Useful functions
   */

  Amber.define('Utilities', function(){
    /**
     * Checks to see if a var is an object
     *
     * @param  {Object}  obj variable to test
     *
     * @return {Boolean}
     */
    var isObject = function(obj) {
      return {}.toString.call(obj) === '[object Object]';
    };

    /**
     * Checks to see if a var is a string
     *
     * @param  {String}  str var to check
     *
     * @return {Boolean}     [description]
     */
    var isString = function(str) {
      return {}.toString.call(str) === '[object String]';
    };

    /**
     * Checks to see if a var is a string
     *
     * @param  {String}  str var to check
     *
     * @return {Boolean}     [description]
     */
    var isFunction = function(str) {
      return {}.toString.call(str) === '[object Function]';
    };

    /**
     * Checks to see if a var is a function or object
     *
     * @param  {Mixed}  obj  var to check
     *
     * @return {Boolean}
     */
    var isIterable = function(obj) {
      var result = {}.toString.call(obj);
      return result === '[object Object]' || result === '[object Function]';
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
     * @param  {Object} object  Object to look in
     * @param  {String} name    Object key to get
     * @param  {Mixed}  context `this` context to Apply
     * @param  {Mixed}  args    Additional arguments to pass to function context
     *
     * @return {Mixed}
     */
    var results = function(object, name, context) {
      if (isFunction(object[name])) {
        var args = Array.prototype.slice.call(arguments).slice(3);
        return object[name].apply(context || this, args);
      }
      return object[name];
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

  /*****************************************************************************
   * Extend
   *
   * @file    Allows a function to be extended such as View
   */

  Amber.define('extend', ['Utilities'], function(_) {

    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child = function() {
        return parent.apply(this, arguments);
      };

      // Add static properties to the constructor function, if supplied.
      _.assign(child, parent, staticProps);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function() {
        this.constructor = child;
      };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate();

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) {
        _.assign(child.prototype, protoProps);
      }

      child.extend = extend;

      return child;
    };

    return extend;
  });

  /*****************************************************************************
   * View
   *
   * @file    View module
   */

  Amber.define('View', ['Utilities', 'extend'], function(_, extend){

    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    function View(options) {
      this.id = _.uniqueId('view');

      // Default Options
      _.assign(this, options || {});

      // Make sure an element exists we can manipulate
      this._ensureElement();

      // Initialize the view and pass options
      this.init.apply(this, arguments);

      // Delegate the view's events
      this.delegateEvents();
    }

    _.assign(View.prototype, {
      /**
       * Default element type
       * @type {String}
       */
      tagName: 'div',

      /**
       * HTML string to use with _.template
       * @type {String}
       */
      template: '',

      /**
       * List of events and functions to be called
       * @type {Object}
       */
      events: {},

      /**
       * Data to be rendered
       * @type {Object}
       */
      model: {},

      /**
       * Runs when the View is created
       */
      init: function() {},

      /**
       * Default rendering function
       */
      render: function() {
        var data = {};
        data = this.model || {};
        this.$el.html(_.template(this.template, data));
        return this;
      },

      /**
       * Search for selectors within view $el
       * @param  {string} selector jQuery selector
       * @return {object}          jQuery object
       */
      $: function(selector) {
        return this.$el.find(selector);
      },

      /**
       * Removes view
       */
      remove: function() {
        this.$el.remove();
        return this;
      },

      /**
       * Setup el/$el as JS/Jquery elements
       * and delegate events
       *
       * @param {string || object} element  element to attach to
       * @param {boolean} delegate delegate events after we attach?
       */
      setElement: function(element, delegate) {
        if (this.$el) {
          this.undelegateEvents();
        }

        this.$el = element instanceof Amber.$ ? element : Amber.$(element);
        this.el = this.$el[0];

        if (delegate === true) {
          this.delegateEvents();
        }
        return this;
      },

      /**
       * If $el is defined then set the element otherwise create
       * a new element we can manipulate
       */
      _ensureElement: function() {
        if (!this.$el) {
          var attrs = _.assign({}, _.results(this, 'attributes'));
          if (this.id) {
            attrs.id = _.results(this, 'id');
          }
          if (this.className) {
            attrs['class'] = _.results(this, 'className');
          }
          var $el = Amber.$('<' + _.results(this, 'tagName') + '>').attr(attrs);
          this.setElement($el, false);
        } else {
          this.setElement(_.results(this, '$el'), false);
        }
      },

      /**
       * Turn off events for this view
       */
      undelegateEvents: function() {
        this.$el.off('.delegateEvents' + this.cid);
        return this;
      },

      /**
       * Attach events to the DOM
       */
      delegateEvents: function() {
        if(!this.el) {
          return this;
        }
        // Undelegate existing events so we don't double up
        this.undelegateEvents();

        for (var key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            // Find the method to call
            var method = this[this.events[key]];

            // Ensure the right this
            method = _.bind(method, this);

            // Split the vent name into piecs
            var match = key.match(delegateEventSplitter);

            var eventName = match[1];
            var selector = match[2];

            eventName += '.delegateEvents' + this.cid;

            // If not selector is found attach it to the entire view
            if (selector === '') {
              this.$el.on(eventName, method);
            } else {
              this.$el.on(eventName, selector, method);
            }
          }
        }
        return this;
      }
    });

    View.extend = extend;

    return View;
  });

  /*****************************************************************************
   * Supports
   *
   * @file    Feature detection
   */

  Amber.define('Supports', ['Utilities'], function(_) {
    var Supports = {
      $$tests: {
        svg: function() {
          // Based on Modernizr
          return !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
        },
        draganddrop: function() {
          // Base on Modernizr
          var div = document.createElement('div');
          return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
        },
        touch: function() {
          return 'ontouchstart' in window || 'onmsgesturechange' in window;
        },
        cssanimations: function() {
          // https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
          var docElem = document.body || document.documentElement;
          var style = docElem.style;
          var tag = 'transition';
          var prefixes;

          if (_.isString(style[tag])) {
            return true;
          }

          // Tests for vendor specific prop
          prefixes = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
          tag = tag.charAt(0).toUpperCase() + tag.substr(1);
          for (var i = 0, l = prefixes.length; i < l; i++) {
            if (_.isString(style[prefixes[i] + tag])) {
              return true;
            }
          }
          return false;
        },
        animationframes: function() {
          var vendorPrefixes = ['ms', 'moz', 'webkit', 'o'];
          for (var x = 0; x < vendorPrefixes.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendorPrefixes[x] + 'RequestAnimationFrame'];
          }
          return !!window.requestAnimationFrame;
        }
      }
    };

    function initialize() {
      for (var prop in this.$$tests) {
        if (this.$$tests.hasOwnProperty(prop)) {
          this[prop] = _.results(this.$$tests, prop);
        }
      }
      return this;
    }

    return initialize.call(Supports);
  });

  /*****************************************************************************
   * Browser
   *
   * @file    User Agent detection
   */

  Amber.define('Browser', function() {
    var Browser = {
      iOS: null,
      iPhone: null,
      iPad: null,
      android: null,
      blackberry: null,
      iemobile: null,
      firefox: null,
      chrome: null,
      safari: null,
      ie: null,
      mobile: null,
      $$check: function(userAgent) {
        this.iOS = !!userAgent.match(/iPad|iPhone|iPod/i);
        this.iPhone = !!userAgent.match(/iPhone/i);
        this.iPad = !!userAgent.match(/iPad/i);
        this.android = !!userAgent.match(/Android/i);
        this.blackberry = !!userAgent.match(/BlackBerry/i);
        this.iemobile = !!userAgent.match(/IEMobile/i);
        this.firefox = !!userAgent.match(/Firefox/i);
        this.chrome = !!userAgent.match(/Chrome/i);
        this.safari = !!userAgent.match(/(Version\/\d\.\d.*Safari)/i);
        this.ie = userAgent.match(/MSIE\s([0-9]{1,}[\.0-9]{0,})/i) || false;

        this.mobile = this.iOS || this.android || this.blackberry || this.iemobile;

        // Get the version number so we can use the <> operators
        if (this.ie) {
          this.ie = Math.floor(this.ie[1]);
        }
        return this;
      }
    };

    return Browser.$$check(navigator.userAgent);
  });

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

  /*****************************************************************************
   * jQuery
   *
   * @file    jQuery wrapper
   * @alias
   */

  Amber.define('jQuery', function(){
    return Amber.$ || $;
  });

  /*****************************************************************************
   * $window
   *
   * @alias
   * @file    window wrapper
   */

  Amber.define('$window', function(){
    return window;
  });

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

  return Amber;
}));
