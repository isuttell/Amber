/*****************************************************************************
* View
*
* @file    View module
*/

var _ = require('./utilities');
var $ = require('./jquery');

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

    this.$el = element instanceof $ ? element : $(element);
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
      var $el = $('<' + _.results(this, 'tagName') + '>').attr(attrs);
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

View.extend = require('../lib/extend');

module.exports = View;
