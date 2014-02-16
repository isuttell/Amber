/*
|--------------------------------------------------------------------------
| Amber
|--------------------------------------------------------------------------
| Basic View Framework for animating single page apps based on Backbone
|
| Contributor: Isaac Suttell <isaac@e-mc2.com>
|
*/


(function() {
    "use strict";

    var root = this;

    var Amber = root.Amber = {};

    //Version
    Amber.VERSION = '0.1.0';

    //Require Lodash/Underscore
    var _ = Amber._ = root._;


    //Require jQuery/Zepto
    Amber.$ = root.jQuery || root.Zepto || root.$;

    /*
    |--------------------------------------------------------------------------
    | Compability Checks
    |--------------------------------------------------------------------------
    */
    Amber.Supports = {
        tests: {
            svg: function() {
                // Based on Modernizr
                return !!document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
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
                var docElem = document.body || document.documentElement,
                    style = docElem.style,
                    tag = 'transition',
                    prefixes;

                if (typeof style[tag] == 'string') {
                    return true;
                }

                // Tests for vendor specific prop
                prefixes = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
                tag = tag.charAt(0).toUpperCase() + tag.substr(1);
                for (var i = 0, l = prefixes.length; i < l; i++) {
                    if (typeof style[prefixes[i] + tag] == 'string') {
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
                this[prop] = _.result(this.tests, prop);
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
        numberWithCommas: function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        stripTrailingZero: function(x) {
            return x.toString().replace(/\.0/, '');
        },
        basicPluralize: function(word, count) {
            if (isNaN(count) || count < 0) {
                return void 0;
            }
            if (count === 1) {
                return word;
            }
            if (count > 1) {
                return word + 's';
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
        iOS: !! navigator.userAgent.match(/iPad|iPhone|iPod/gi),
        iPhone: !! navigator.userAgent.match(/iPhone/gi),
        iPad: !! navigator.userAgent.match(/iPad/gi),
        android: !! navigator.userAgent.match(/Android/gi),
        blackberry: !! navigator.userAgent.match(/BlackBerry/gi),
        iemobile: !! navigator.userAgent.match(/IEMobile/gi),
        firefox: !! navigator.userAgent.match(/Firefox/gi),
        chrome: !! navigator.userAgent.match(/Chrome/gi),
        safari: !! navigator.userAgent.match(/(Version\/\d\.\d.*Safari)/gi),
        ie: navigator.userAgent.match(/MSIE\s([0-9]{1,}[\.0-9]{0,})/gi) || false,
        initialize: function() {
            this.mobile = this.iOS || this.android || this.blackberry || this.iemobile;
            return this;
        }
    }.initialize();


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
                // Find the method to call
                var method = this[this.events[key]];

                // Ensure the right this
                method = _.bind(method, this);

                // Split the vent name into piecs
                var match = key.match(this.delegateEventSplitter);

                var eventName = match[1],
                    selector = match[2];

                eventName += '.delegateEvents' + this.cid;

                // If not selector is found attach it to the entire view
                if (selector === '') {
                    this.$el.on(eventName, method);
                } else {
                    this.$el.on(eventName, selector, method);
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
            var once = _.once(function() {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        //Turn off an event on this object
        off: function(name, callback, context) {
            var retain, ev, events, names, i, l, j, k;

            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = {};
                return this;
            }
            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events == this._events[name]) {
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
                    if (!retain.length) delete this._events[name];
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
            var allEvents = this._events.all;
            if (events) {
                triggerEvents(events, args);
            }
            if (allEvents) {
                triggerEvents(allEvents, arguments);
            }
            return this;
        },

        //Stop listening to an event
        stopListening: function(obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }

            var remove = !name && !callback;
            if (!callback && typeof name === 'object') {
                callback = this;
            }
            if (obj)(listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        },

        /**
         * If $el is defined then set the element otherwise create
         * a new element we can manipulate
         */
        _ensureElement: function() {
            if (!this.$el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id) attrs.id = _.result(this, 'id');
                if (this.className) attrs['class'] = _.result(this, 'className');
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
     * "change blur" and jQuery-style event maps {change: action} in terms
     * of the existing API.
     */
    var eventsApi = function(obj, action, name, rest) {
        if (!name) {
            return true;
        }
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
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
        var ev, i = -1,
            l = events.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l)(ev = events[i]).callback.call(ev.ctx);
                return;
            case 1:
                while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
                return;
            case 2:
                while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
                return;
            case 3:
                while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
                return;
            default:
                while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
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
    _.extend(Vent.prototype, Events);
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
         * @param {object} view an Amber View
         */
        _add: function(view) {
            this._views.push(view);
        },

        /**
         * Search for a view by its cid
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
         * @return {[type]} [description]
         */
        all: function() {
            return this._views;
        }
    };


    var Model = Amber.Model = function(attributes, options) {

        this.cid = _.uniqueId('model');

        // Default Options
        options = options || {};
        _.extend(this, options);

        var attrs = attributes || {};

        this.attributes = _.defaults({}, attrs, _.result(this, 'defaults'));

        this.initialize.apply(this, arguments);

    };

    _.extend(Model.prototype, Events, {
        defaults: {},
        initialize: function() {},

        /**
         * Return a JSON friendly copy of the data
         * @return {object}
         */
        toJSON: function() {
            return _.clone(this.attributes);
        },

        /**
         * Get a specific attribute
         * @param  {string} attr
         * @return {any}
         */
        get: function(attr) {
            return this.attributes[attr];
        },

        /**
         * Check to see if an attribute exists
         * @param  {string}  attr
         * @return {Boolean}
         */
        has: function(attr) {
            return this.get(attr) !== null && typeof this.get(attr) !== 'undefined';
        },

        /**
         * Defaults to global sync but may be
         * overriden on a per model basis
         * @return {function} defaults to jQuery.aJax
         */
        sync: function() {
            return Amber.sync.apply(this, arguments);
        },

        /**
         * Accepts either key, value or an object
         * and then updates the model. If the silent
         * option is used it won't trigger any events,
         * and if the unset option is true it will remove
         * the attribute(s)
         * @param {string || object} key     key or object of key/values
         * @param {string || object} value   the value or options
         * @param {object} options
         */
        set: function(key, value, options) {
            var attr,
                attrs,
                unset,
                changes,
                silent,
                current;

            if (key === null || typeof key === "undefined") {
                return this;
            }

            if (typeof key === "object") {
                attrs = key;
                options = value;
            } else {
                (attrs = {})[key] = value;
            }

            options = options || {};

            unset = options.unset;
            silent = options.silent;
            changes = [];
            current = this.attributes;


            // Update the Value
            for (attr in attrs) {
                value = attrs[attr];

                if (!_.isEqual(current[attr], value)) {
                    changes.push(attr);
                }
                if (unset) {
                    delete current[attr];
                } else {
                    current[attr] = value;
                }
            }

            // Trigger Change Events
            if (!silent) {
                this.trigger('change', this, options);

                if (changes.length) {
                    for (var i = 0, l = changes.length; i < l; i++) {
                        this.trigger('change:' + changes[i], this, current[changes[i]], options);
                    }
                }
            }

            return this;
        },

        /**
         * Shortcut to unset a specific property in the model
         * @param  {string} attr    the name of the attribute
         * @param  {object} options
         */
        unset: function(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {
                unset: true
            }));
        },

        /**
         * Empties the model of all attributes
         * @param  {object} options
         */
        clear: function(options) {
            var attrs = {};
            for (var key in this.attributes) {
                attrs[key] = void 0;
            }
            return this.set(attrs, _.extend({}, options, {
                unset: true
            }));
        },

        /**
         * Grabs data from the server, accepts callbacks
         * for success, error, complete and passes any other
         * options directly to Amber.ajax
         * @param  {object} options
         * @return {object}           xhr object
         */
        fetch: function(options) {
            options = options ? _.clone(options) : {};

            var model = this;

            // Ajax Event
            var success = options.success;
            options.success = function(resp) {
                if (success) {
                    model.set(resp, options);
                    success(model, resp, options);
                }
                model.trigger('sync', model, resp, options);
            };

            // Ajax Event
            var complete = options.complete;
            options.complete = function(resp) {
                if (complete) {
                    complete(model, resp, options);
                }
            };

            // Ajax Event
            var error = options.error;
            options.error = function(resp) {
                if (error) {
                    error(model, resp, options);
                }
            };
            return this.sync('GET', this, options);
        }
    });

    Amber.sync = function(method, model, options) {

        var params = {
            type: method,
            dataType: 'json',
        };

        if (!options.url) {
            params.url = _.result(model, 'url') || urlError();
        }

        var xhr = options.xhr = Amber.ajax(_.extend(params, options));
        model.trigger('request', model, xhr, options);
        return xhr;
    };

    /**
     * Defaults to jQuery's ajax
     */
    Amber.ajax = function() {
        return Amber.$.ajax.apply(Amber.$, arguments);
    };

    /*
    |--------------------------------------------------------------------------
    | URL Error Function
    |--------------------------------------------------------------------------
    | Throw an error when we don't have an url for fetching
    */

    var urlError = function() {
        throw new Error('A "url" property or function must be specified');
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
        options = options || {};
        _.extend(this, options);

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
    _.extend(View.prototype, Events, {
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
         * Function to parse data
         * returns this so we can chain
         * with render()
         */
        format: function() {
            return this;
        },

        /**
         * Default rendering function
         */
        render: function() {
            this.trigger('before:render');
            var data = {};
            if (this.model instanceof Amber.Model) {
                data = this.model.toJSON();
            } else {
                data = this.model || {};
            }
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
            this.stopListening();
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
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    View.extend = Model.extend = extend;

    /*
    |--------------------------------------------------------------------------
    | Animations
    |--------------------------------------------------------------------------
    | Todo: add easing functions
    */

    Amber.scrollTo = function(selector, options) {
        selector = selector instanceof Amber.$ ? selector : Amber.$(selector);

        //Defaults
        options = options || {};
        options.offset = options.offset || 0;
        options.duration = options.duration || 500;
        options.easing = options.easing || 'easeInOutExpo';

        //Scroll to selector
        Amber.$('html, body').stop().animate({
            scrollTop: selector.offset().top - options.offset
        }, options.duration, options.easing);
    };

    /*
    |--------------------------------------------------------------------------
    | On Scroll Animate In
    |--------------------------------------------------------------------------
    |
    */

    /*
        TODO:
        - Fix Performance: Currently cuts FPS nearly in half
    */

    var AnimateIn = Amber.AnimateIn = function(el, options) {
        this.el = el;
        this.options = extend(this.defaults, options);
        this._init();
    };

    AnimateIn.prototype = {
        defaults: {
            viewportFactor: 0.2
        },
        docElem: window.document.documentElement,
        getViewportHeight: function() {
            var client = this.docElem.clientHeight,
                inner = window.innerHeight;

            if (client < inner) {
                return inner;
            } else {
                return client;
            }
        },
        getOffset: function(el) {
            var offsetTop = 0,
                offsetLeft = 0;
            do {
                if (!isNaN(el.offsetTop)) {
                    offsetTop += el.offsetTop;
                }
                if (!isNaN(el.offsetLeft)) {
                    offsetLeft += el.offsetLeft;
                }
            } while (el == el.offsetParent);

            return {
                top: offsetTop,
                left: offsetLeft
            };
        },
        inViewport: function(el, h) {
            var elH = el.offsetHeight,
                scrolled = window.pageYOffset || this.docElem.scrollTop,
                viewed = scrolled + this.getViewportHeight(),
                elTop = this.getOffset(el).top,
                elBottom = elTop + elH;
            // if 0, the element is considered in the viewport as soon as it enters.
            // if 1, the element is considered in the viewport only when it's fully inside
            // value in percentage (1 >= h >= 0)
            h = h || 0;

            return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
        },
        _init: function() {
            if (Modernizr.touch) {
                return;
            }

            this.sections = Array.prototype.slice.call(this.el.querySelectorAll('.amber-animate-section'));
            this.didScroll = false;

            var self = this;

            this.sections.forEach(function(el) {
                if (!self.inViewport(el)) {
                    $(el).addClass('amber-animate-section-init');
                }
            });
            var scrollHandler = function() {
                //Throttle
                if (!self.didScroll) {
                    self.didScroll = true;
                    setTimeout(function() {
                        self._scrollPage();
                    }, 100);
                }
            };
            var resizeHandler = function() {
                function delayed() {
                    self._scrollPage();
                    self.resizeTimeout = null;
                }
                if (self.resizeTimeout) {
                    clearTimeout(self.resizeTimeout);
                }
                self.resizeTimeout = setTimeout(delayed, 200);
            };
            window.addEventListener('scroll', scrollHandler, false);
            window.addEventListener('resize', resizeHandler, false);
        },
        _scrollPage: function() {
            var self = this;

            this.sections.forEach(function(el) {
                if (self.inViewport(el, self.options.viewportFactor)) {
                    $(el).addClass('amber-animate-section-animate');
                } else {
                    $(el).addClass('amber-animate-section-init');
                    $(el).removeClass('amber-animate-section-animate');
                }
            });
            this.didScroll = false;
        }
    };

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
     * @param {array} images  Takes an array of image src
     * @param {Object} options Optional done and progress callbacks
     */
    Amber.Preload = function(urls, options) {
        var images,
            loaded,
            progress,
            done;

        if (typeof urls === "string") {
            urls = [urls];
        }

        options = options || {};

        images = [];
        loaded = 0;

        progress = options.progress;
        done = options.done;

        var imageDone = function() {
            loaded++;

            if (progress) {
                progress(loaded / urls.length, loaded, urls.length, images[images.length - 1]);
            }

            if (loaded === urls.length && options.done) {
                options.done(images);
            }
        };

        _.each(urls, function(src) {
            var image = new Image();
            image.src = src;
            image.onload = imageDone;
            image.onerror = imageDone;
            images.push(image);
        });
    };

    /* ============================================================
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Open source under the BSD License.
     *
     * Copyright © 2008 George McGinley Smith
     * All rights reserved.
     * https://raw.github.com/danro/jquery-easing/master/LICENSE
     * ======================================================== */

    Amber.$.easing['jswing'] = Amber.$.easing['swing'];

    Amber.$.extend(Amber.$.easing, {
        // t: current time, b: begInnIng value, c: change In value, d: duration

        def: 'easeOutQuad',
        swing: function(x, t, b, c, d) {
            //alert(Amber.$.easing.default);
            return Amber.$.easing[Amber.$.easing.def](x, t, b, c, d);
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function(x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function(x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function(x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeInBounce: function(x, t, b, c, d) {
            return c - Amber.$.easing.easeOutBounce(x, d - t, 0, c, d) + b;
        },
        easeOutBounce: function(x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOutBounce: function(x, t, b, c, d) {
            if (t < d / 2) return Amber.$.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return Amber.$.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });

    /*!
     *
     * TERMS OF USE - EASING EQUATIONS
     *
     * Open source under the BSD License.
     *
     * Copyright © 2001 Robert Penner
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

}).call(this);