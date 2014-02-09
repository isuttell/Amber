/*
|--------------------------------------------------------------------------
| Amber
|--------------------------------------------------------------------------
| Basic View Framework for animating single page apps based on Backbone
|
| Contributor: Isaac Suttell <isaac@e-mc2.com>
|
*/


(function()
{
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
		tests:
		{
			svg: function()
			{
				// Based on Modernizr
				return !!document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
			},
			draganddrop: function()
			{
				// Base on Modernizr
				var div = document.createElement('div');
				return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
			},
			touch: function()
			{
				return 'ontouchstart' in window || 'onmsgesturechange' in window;
			},
			cssanimations: function()
			{
				// https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
				var docElem = document.body || document.documentElement,
					style = docElem.style,
					tag = 'transition',
					prefixes;

				if (typeof style[tag] == 'string')
				{
					return true;
				}

				// Tests for vendor specific prop
				prefixes = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'],
				tag = tag.charAt(0).toUpperCase() + tag.substr(1);
				for (var i = 0, l = prefixes.length; i < l; i++)
				{
					if (typeof style[prefixes[i] + tag] == 'string')
					{
						return true;
					}
				}
				return false;
			},
			animationframes: function(){
				var vendorPrefixes = ['ms', 'moz', 'webkit', 'o'];
				for (var x = 0; x < vendorPrefixes.length && !window.requestAnimationFrame; ++x)
				{
					window.requestAnimationFrame = window[vendorPrefixes[x] + 'RequestAnimationFrame'];
				}
				return !!window.requestAnimationFrame;
			}
		},
		initialize: function()
		{
			for (var prop in this.tests)
			{
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

	var Format = Amber.Format = {
		numberWithCommas: function(x)
		{
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		stripTrailingZero: function(x)
		{

			return x.toString().replace(/\.0/, '');
		},
		basicPluralize: function(word, count)
		{
			if (isNaN(count) || count < 0)
			{
				return void 0;
			}
			if (count === 1)
			{
				return word;
			}
			if (count > 1)
			{
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

	var Browser = Amber.Browser = {
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
		initialize: function()
		{
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
		undelegateEvents: function()
		{
			this.$el.off('.delegateEvents' + this.cid);
			return this;
		},
		delegateEvents: function()
		{
			this.undelegateEvents();
			for (var key in this.events)
			{
				var method = this[this.events[key]];

				var match = key.match(this.delegateEventSplitter);
				var eventName = match[1],
					selector = match[2];
				method = _.bind(method, this);
				eventName += '.delegateEvents' + this.cid;
				if (selector === '')
				{
					this.$el.on(eventName, method);
				}
				else
				{
					this.$el.on(eventName, selector, method);
				}
			}
			return this;
		},
		// Assign an event to this object
		// supports multiple event changes
		on: function(name, callback, context)
		{
			if (!eventsApi(this, 'on', name, [callback, context]) || !callback)
			{
				return this;
			}
			this._events || (this._events = {});
			var events = this._events[name] || (this._events[name] = []);
			events.push(
			{
				callback: callback,
				context: context,
				ctx: context || this
			});
			return this;
		},
		//Only call the callbackonce
		once: function(name, callback, context)
		{
			if (!eventsApi(this, 'once', name, [callback, context]) || !callback)
			{
				return this;
			}
			var self = this;
			var once = _.once(function()
			{
				self.off(name, once);
				callback.apply(this, arguments);
			});
			once._callback = callback;
			return this.on(name, once, context);
		},
		//Turn off an event on this object
		off: function(name, callback, context)
		{
			var retain, ev, events, names, i, l, j, k;

			if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
			if (!name && !callback && !context)
			{
				this._events = {};
				return this;
			}
			names = name ? [name] : _.keys(this._events);
			for (i = 0, l = names.length; i < l; i++)
			{
				name = names[i];
				if (events == this._events[name])
				{
					this._events[name] = retain = [];
					if (callback || context)
					{
						for (j = 0, k = events.length; j < k; j++)
						{
							ev = events[j];
							if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
								(context && context !== ev.context))
							{
								retain.push(ev);
							}
						}
					}
					if (!retain.length) delete this._events[name];
				}
			}

			return this;
		},
		//Trigger an event
		trigger: function(name)
		{
			if (!this._events)
			{
				return this;
			}
			var args = [].slice.call(arguments, 1);
			if (!eventsApi(this, 'trigger', name, args))
			{
				return this;
			}
			var events = this._events[name];
			var allEvents = this._events.all;
			if (events)
			{
				triggerEvents(events, args);
			}
			if (allEvents)
			{
				triggerEvents(allEvents, arguments);
			}
			return this;
		},
		//Stop listening to an event
		stopListening: function(obj, name, callback)
		{
			var listeningTo = this._listeningTo;
			if (!listeningTo) return this;
			var remove = !name && !callback;
			if (!callback && typeof name === 'object') callback = this;
			if (obj)(listeningTo = {})[obj._listenId] = obj;
			for (var id in listeningTo)
			{
				obj = listeningTo[id];
				obj.off(name, callback, this);
				if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
			}
			return this;
		},
		_ensureElement: function()
		{
			if (!this.$el)
			{
				var attrs = _.extend(
				{}, _.result(this, 'attributes'));
				if (this.id) attrs.id = _.result(this, 'id');
				if (this.className) attrs['class'] = _.result(this, 'className');
				var $el = Amber.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
				this.setElement($el, false);
			}
			else
			{
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
	var eventsApi = function(obj, action, name, rest)
	{
		if (!name)
		{
			return true;
		}
		if (typeof name === 'object')
		{
			for (var key in name)
			{
				obj[action].apply(obj, [key, name[key]].concat(rest));
			}
			return false;
		}
		if (eventSplitter.test(name))
		{
			var names = name.split(eventSplitter);
			for (var i = 0, l = names.length; i < l; i++)
			{
				obj[action].apply(obj, [names[i]].concat(rest));
			}
			return false;
		}
		return true;
	};

	// Event Dispact
	var triggerEvents = function(events, args)
	{
		var ev, i = -1,
			l = events.length,
			a1 = args[0],
			a2 = args[1],
			a3 = args[2];
		switch (args.length)
		{
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

	var Vent = function()
	{
		this.cid = _.uniqueId('vent');
	};
	_.extend(Vent.prototype, Events);
	Amber.Vent = new Vent();

	/*
	|--------------------------------------------------------------------------
	| View
	|--------------------------------------------------------------------------
	| Core View Object
	*/

	var View = Amber.View = function(options)
	{
		this.cid = _.uniqueId('view');
		options || (options = {});
		_.extend(this, options);
		this._ensureElement();
		if(options.$el) {
			this.setElement(options.$el, false);
		}
		if(options.initializeOnLoad === true) {
			this.initialize();
		}
		this.delegateEvents();
	};


	/*
		TODO:
		- Implement setElement and _ensureElement better
	*/
	_.extend(View.prototype, Events,
	{
		tagName: 'div',
		template: '',
		events:
		{},
		data:
		{},
		transitionTime: 300,
		initialize: function()
		{
			if (this.$el)
			{
				this.setElement(this.$el, true);
			}
		},
		format: function()
		{
			return this;
		},
		render: function(options)
		{
			this.trigger('before:render');
			this.$el.html(_.template(this.template, this.data));
			this.trigger('after:render');
			return this;
		},
		$: function(selector)
		{
			return this.$el.find(selector);
		},
		remove: function()
		{
			this.$el.remove();
			this.stopListening();
			return this;
		},
		setElement: function(element, delegate)
		{
			if (this.$el)
			{
				this.undelegateEvents();
			}

			this.$el = element instanceof Amber.$ ? element : Amber.$(element);
			this.el = this.$el[0];

			if (delegate !== false)
			{
				this.delegateEvents();
			}
			return this;
		},
		svgFallback: function(string)
		{
			if (!Amber.Supports.svg)
			{
				return string.replace(/\.svg/g, '.png');
			}
			else
			{
				return string;
			}
		},
		transition: function($to, direction)
		{
			var self = this;
			this.trigger('before:transition');

			direction = direction || 1;
			switch (direction)
			{
				case 'forward':
					direction = 1;
					break;
				case 'back':
					direction = -1;
					break;
			}


			if (Amber.Supports.cssanimations)
			{
				$to.$el.addClass('amber-animate-init').removeClass('amber-animate-in');
				this.$el.removeClass('amber-animate-in');
			}

			this.undelegateEvents();

			/*--------------------------------------------------------------------------
			| Animate Out
			*/
			this.$el.animate(
			{
				left: ($(window).width()) * (-direction),
			}, this.transitionTime, 'easeInOutExpo', function()
			{
				$(this).hide();
				self.trigger('after:transition');
			});


			/*--------------------------------------------------------------------------
			| Animate in
			*/

			// Initialize the panel
			$to.initialize();

			$to.$el.show().css(
			{
				left: $(window).width() * direction,
			}).show().animate(
			{
				left: 0,
			}, this.transitionTime, 'easeInOutExpo', function()
			{
				if (Amber.Supports.cssanimations)
				{
					$to.$el.addClass('amber-animate-in');
				}
			});

		}
	});

	/*
	|--------------------------------------------------------------------------
	| Extend
	|--------------------------------------------------------------------------
	|
	*/

	var extend = function(protoProps, staticProps)
	{
		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor'))
		{
			child = protoProps.constructor;
		}
		else
		{
			child = function()
			{
				return parent.apply(this, arguments);
			};
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function()
		{
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

	View.extend = extend;



	/*
	|--------------------------------------------------------------------------
	| Animations
	|--------------------------------------------------------------------------
	|
	*/

	var Animate = Amber.Animate = {
		scrollTo: function(selector, offset)
		{
			offset || (offset = 0);
			selector = selector instanceof Amber.$ ? selector : Amber.$(selector);

			//Scroll to section
			$('html, body').animate(
			{
				scrollTop: selector.offset().top - offset
			}, 500, 'easeInOutExpo');

		}
	}

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

	var AnimateIn = Amber.Animate.AnimateIn = function(el, options)
	{
		this.el = el;
		this.options = extend(this.defaults, options);
		this._init();
	};

	AnimateIn.prototype = {
		defaults:
		{
			viewportFactor: 0.2
		},
		docElem: window.document.documentElement,
		getViewportHeight: function()
		{
			var client = this.docElem['clientHeight'],
				inner = window['innerHeight'];

			if (client < inner)
			{
				return inner;
			}
			else
			{
				return client;
			}
		},
		getOffset: function(el)
		{
			var offsetTop = 0,
				offsetLeft = 0;
			do {
				if (!isNaN(el.offsetTop))
				{
					offsetTop += el.offsetTop;
				}
				if (!isNaN(el.offsetLeft))
				{
					offsetLeft += el.offsetLeft;
				}
			} while (el == el.offsetParent);

			return {
				top: offsetTop,
				left: offsetLeft
			}
		},
		inViewport: function(el, h)
		{
			var elH = el.offsetHeight,
				scrolled = window.pageYOffset || this.docElem.scrollTop,
				viewed = scrolled + this.getViewportHeight(),
				elTop = this.getOffset(el).top,
				elBottom = elTop + elH,
				// if 0, the element is considered in the viewport as soon as it enters.
				// if 1, the element is considered in the viewport only when it's fully inside
				// value in percentage (1 >= h >= 0)
				h = h || 0;

			return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
		},
		_init: function()
		{
			if (Modernizr.touch)
			{
				return;
			}

			this.sections = Array.prototype.slice.call(this.el.querySelectorAll('.amber-animate-section'));
			this.didScroll = false;

			var self = this;

			this.sections.forEach(function(el, i)
			{
				if (!self.inViewport(el))
				{
					$(el).addClass('amber-animate-section-init');
				}
			});
			var scrollHandler = function()
			{
				//Throttle
				if (!self.didScroll)
				{
					self.didScroll = true;
					setTimeout(function()
					{
						self._scrollPage();
					}, 100);
				}
			};
			var resizeHandler = function()
			{
				function delayed()
				{
					self._scrollPage();
					self.resizeTimeout = null;
				}
				if (self.resizeTimeout)
				{
					clearTimeout(self.resizeTimeout);
				}
				self.resizeTimeout = setTimeout(delayed, 200);
			};
			window.addEventListener('scroll', scrollHandler, false);
			window.addEventListener('resize', resizeHandler, false)
		},
		_scrollPage: function()
		{
			var self = this;

			this.sections.forEach(function(el, i)
			{
				if (self.inViewport(el, self.options.viewportFactor))
				{
					$(el).addClass('amber-animate-section-animate');
				}
				else
				{
					$(el).addClass('amber-animate-section-init');
					$(el).removeClass('amber-animate-section-animate');
				}
			});
			this.didScroll = false;
		}
	}

}).call(this);