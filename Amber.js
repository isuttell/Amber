/*
|--------------------------------------------------------------------------
| Amber
|--------------------------------------------------------------------------
| Basic View Framework for animating single page apps based on Backbone
|
| Contributor: Isaac Suttell <isaac@e-mc2.com>
|
*/

(function(root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'jquery', 'exports'], function(_, $, exports) {
      return factory(root, exports, _, $);
    });
  } else {
    root.Amber = factory(root, {}, root._, (root.jQuery || root.$));
  }
}(this, function(root, Amber, _, $) {
  'use strict';

  //Version
  Amber.VERSION = '0.5.0';

  //Require jQuery/Zepto
  Amber.$ = $;

  /**
   * Utility Functions
   *
   * Make this public so we can test easier
   *
   * @type {Object}
   */
  Amber._util = {};

  /**
   * Checks to see if a var is an object
   *
   * @param  {Object}  obj variable to test
   *
   * @return {Boolean}
   */
  var isObject = Amber._util.isObject = function(obj) {
    return {}.toString.call(obj) === '[object Object]';
  };

  /**
   * Checks to see if a var is a string
   *
   * @param  {String}  str var to check
   *
   * @return {Boolean}     [description]
   */
  var isString = Amber._util.isString = function(str) {
    return {}.toString.call(str) === '[object String]';
  };

  /**
   * Checks to see if a var is a string
   *
   * @param  {String}  str var to check
   *
   * @return {Boolean}     [description]
   */
  var isFunction = Amber._util.isFunction = function(str) {
    return {}.toString.call(str) === '[object Function]';
  };

  /**
   * Checks to see if a var is a function or object
   *
   * @param  {Mixed}  obj  var to check
   *
   * @return {Boolean}
   */
  var isIterable = Amber._util.isIterable = function(obj) {
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
  var runOnce = Amber._util.runOnce = function(fn) {
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
   * Extends multiple objects
   *
   * @param     {Object}    object     input
   * @param     {...Object}    source    defaults
   *
   * @return    {Object}
   */
  var assign = Amber._util.assign = function(object) {
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
  var keys = Amber._util.keys = function(object) {
    var result = [];
    var index;
    if (!isObject(object)) { return object; }

    for (index in object) {
      if (object.hasOwnProperty(index)) {
        result.push(index);
      }
    }
    return result;
  };

  /*
    |--------------------------------------------------------------------------
    | Compability Checks
    |--------------------------------------------------------------------------
    */
  Amber.Supports = {
    tests: {
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

        if (isString(style[tag])) {
          return true;
        }

        // Tests for vendor specific prop
        prefixes = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        tag = tag.charAt(0).toUpperCase() + tag.substr(1);
        for (var i = 0, l = prefixes.length; i < l; i++) {
          if (isString(style[prefixes[i] + tag])) {
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
    },
    initialize: function() {
      for (var prop in this.tests) {
        if (this.tests.hasOwnProperty(prop)) {
          this[prop] = _.result(this.tests, prop);
        }
      }
      return this;
    }
  }.initialize();

  /*
    |--------------------------------------------------------------------------
    | Data Format Functions
    |--------------------------------------------------------------------------
    |
    */

  Amber.Format = {
    /**
     * Split a number with commas
     *
     * @param     {Number}    num    Number to add commas to
     *
     * @return    {String}
     */
    numberWithCommas: function(num) {
      if (!num) { return num; }
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Removes trailing zeros from a float e.g. `1.0` to `1`
     *
     * @param     {number}    num    Float number
     *
     * @return    {String}
     */
    stripTrailingZero: function(num) {
      if (!num) { return num; }
      return num.toString().replace(/\.0/, '');
    },

    /**
     * Takes a word and adds an `s` if count is higher than 1
     *
     * @param     {String}    word
     * @param     {Number}    count
     *
     * @return    {String}
     */
    basicPluralize: function(word, count) {
      if (count && count > 1) {
        return word + 's';
      } else {
        return word;
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | User Agent Detection
  |--------------------------------------------------------------------------
  |
  */

  Amber.Browser = {
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
    check: function(userAgent) {
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
  }.check(navigator.userAgent);

  /*
    |--------------------------------------------------------------------------
    | Event Delegation
    |--------------------------------------------------------------------------
    |
    */

  var Events = Amber.Events = {
    delegateEventSplitter: /^(\S+)\s*(.*)$/,

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
      // Undelegate existing events so we don't double up
      this.undelegateEvents();

      for (var key in this.events) {
        if (this.events.hasOwnProperty(key)) {
          // Find the method to call
          var method = this[this.events[key]];

          // Ensure the right this
          method = _.bind(method, this);

          // Split the vent name into piecs
          var match = key.match(this.delegateEventSplitter);

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
    },

    // Assign an event to this object
    // supports multiple event changes
    on: function(name, callback, context) {
      // Trigger Event API
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {
        return this;
      }

      // Save the event
      this._events = this._events || {};
      var events = this._events[name] || (this._events[name] = []);
      events.push({
        callback: callback,
        context: context,
        ctx: context || this
      });

      return this;
    },

    //Only call the callbackonce
    once: function(name, callback, context) {
      // Trigger Event API
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) {
        return this;
      }
      var self = this;
      var once = runOnce(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    //Turn off an event on this object
    off: function(name, callback, context) {
      var retain;
      var ev;
      var events;
      var names;
      var i;
      var l;
      var j;
      var k;

      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {
        return this;
      }
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        events = this._events[name];
        if (events) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) {
            delete this._events[name];
          }
        }
      }

      return this;
    },

    /**
     * Trigger an event
     * @param  {string} name
     * @return {this}   return this so we can chain
     */
    trigger: function(name) {
      if (!this._events) {
        return this;
      }
      var args = [].slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) {
        return this;
      }
      var events = this._events[name];

      if (events) {
        triggerEvents(events, args);
      }

      return this;
    },

    /**
     * If $el is defined then set the element otherwise create
     * a new element we can manipulate
     */
    _ensureElement: function() {
      if (!this.$el) {
        var attrs = assign({}, _.result(this, 'attributes'));
        if (this.id) {
          attrs.id = _.result(this, 'id');
        }
        if (this.className) {
          attrs['class'] = _.result(this, 'className');
        }
        var $el = Amber.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, '$el'), false);
      }
    }

  };

  // Regex to parse multiple events
  var eventSplitter = /\s+/;

  /**
   * Implement fancy features of the Events API such as multiple event names
   * "change blur"
   */
  var eventsApi = function(obj, action, name, rest) {
    if (!name) {
      return true;
    }

    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }
    return true;
  };

  // Event Dispact
  var triggerEvents = function(events, args) {
    var ev;
    var i = -1;
    var l = events.length;
    while (++i < l) {
      (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  /*
    |--------------------------------------------------------------------------
    | Global Event System
    |--------------------------------------------------------------------------
    |
    */

  var Vent = function() {
    this.cid = _.uniqueId('vent');
  };
  assign(Vent.prototype, Events);
  Amber.Vent = new Vent();

  /*
    |--------------------------------------------------------------------------
    | Views
    |--------------------------------------------------------------------------
    | Repository of all created views
    */

  Amber.Views = {
    _views: [],

    /**
     * Adds a view to the list of views
     *
     * @param {object} view an Amber View
     */
    _add: function(view) {
      this._views.push(view);
    },

    /**
     * Search for a view by its cid
     *
     * @param  {string} cid the unique ID of a view
     * @return {object}
     */
    get: function(cid) {
      return _.find(this._views, function(view) {
        return view.cid === cid;
      });
    },

    /**
     * Get a list of all of the views
     *
     * @return {Array} all current views
     */
    all: function() {
      return this._views;
    },

    /**
     * Remove all or a specific view
     *
     * @param    {string}   cid    view ID
     */
    _clear: function(cid) {
      if (isString(cid)) {
        var index = _.findIndex(this._views, function(view) {
            return view.cid === cid;
          });
        this._views[index].remove();
        this._views.splice(index, 1);
      } else {
        for (var i = 0; i < this._views.length; i++) {
          this._views[i].remove();
        }
        this._views = [];
      }
    }
  };

  /*
    |--------------------------------------------------------------------------
    | View
    |--------------------------------------------------------------------------
    | Core View Object
    */

  var View = Amber.View = function(options) {
    // Give every view a unique id
    this.cid = _.uniqueId('view');

    // Store a list of all the views
    Amber.Views._add(this);

    // Default Options
    this.options = options || {};
    assign(this, options);

    // Make sure an element exists we can manipulate
    this._ensureElement();

    // Initialize the view and pass options
    this.initialize.apply(this, arguments);

    // Let the view know we've initialized
    this.trigger('after:initialize');

    // Delegate the view's events
    this.delegateEvents();
  };

  /*
        TODO:
        - Implement setElement and _ensureElement better
    */
  assign(View.prototype, Events, {
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
    initialize: function() {},

    /**
     * Default rendering function
     */
    render: function() {
      this.trigger('before:render');
      var data = {};
      data = this.model || {};
      this.$el.html(_.template(this.template, data));
      this.trigger('after:render');
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
     * @param {string || object} element  element to attach to
     * @param {boolean} delegate delegate events after we attach?
     */
    setElement: function(element, delegate) {
      if (this.$el) {
        this.undelegateEvents();
      }

      this.$el = element instanceof Amber.$ ? element : Amber.$(element);
      this.el = this.$el[0];

      if (delegate !== false) {
        this.delegateEvents();
      }
      return this;
    }
  });

  /*
  |--------------------------------------------------------------------------
  | Extend
  |--------------------------------------------------------------------------
  |
  */

  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function() {
        return parent.apply(this, arguments);
      };
    }

    // Add static properties to the constructor function, if supplied.
    assign(child, parent, staticProps);

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
      assign(child.prototype, protoProps);
    }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  View.extend = extend;

  /*
  |--------------------------------------------------------------------------
  | Image Preloader
  |--------------------------------------------------------------------------
  | Preloads images so we can ensure they are ready to view
  |
  */

  /**
   * Preload images. Takes two optional callbacks
   * in the options object: done, progress. Done is
   * always called after all of the images are
   * loaded or 404'd. Progress is called each time
   * an image is created
   *
   * Amber.Preload('image.jpg', {
   *    progress: function(percent, current, total){
   *    },
   *    done: function(images){
   *    }
   * });
   *
   * @param {array}  urls    Takes an array of image src
   * @param {Object} options (Optional) done and progress callbacks
   */
  Amber.Preload = function(urls, options) {
    // Setup
    var images;
    var loaded;
    var progress;
    var done;

    if (isString(urls)) {
      urls = [urls];
    }

    options = options || {};

    images = [];
    loaded = 0;

    // Check to see if progress and done are actual functions
    progress = _.isFunction(options.progress) ? options.progress : false;
    done = _.isFunction(options.done) ? options.done : false;

    /**
     * This is called once for each image and triggers the progress or done
     * callbacks accordingly
     */
    var imageAlways = function() {
      loaded++;

      if (progress) {
        progress(loaded / urls.length, loaded, urls.length, images[images.length - 1]);
      }

      if (loaded === urls.length && done) {
        done(images);
      }
    };

    // Cycle through each image
    _.each(urls, function(src) {
      // Ignore everything that is not a string
      if (isString(src)) {
        // Create an unattached image element
        var image = new Image();
        image.src = src;

        // Check to see if the image is already loaded otherwise attach events
        if (!Amber.Preload.isImageLoaded(image)) {
          image.onload = imageAlways;
          image.onerror = imageAlways;
        } else {
          imageAlways.apply(image);
        }

        images.push(image);
      }
    });
  };

  /**
   * Check to see if an image is already loaded
   * http://stackoverflow.com/a/1977898/2489839
   *
   * @param  {Object}  img Image Object
   * @return {Boolean}
   */
  Amber.Preload.isImageLoaded = function(img) {
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

  return Amber;
}));
