/*****************************************************************************
 * Events
 *
 * @file    Pub/sub module
 */

'use strict';

var _ = require('./utilities');

module.exports = {
  /**
   * Assign an event to this object. Supports multiple event changes
   *
   * @param     {String}      name
   * @param     {Function}    callback
   * @param     {Mixed}       context
   * @chainable
   * @return    {this}
   */
  on: function(name, callback, context) {
    if (!callback) {
      return this;
    }
    this._events = this._events || {};
    var events = this._events[name] || (this._events[name] = []);
    events.push({
      callback: callback,
      context: context,
      ctx: context || this
    });

    return this;
  },

  /**
   * Trigger an event once
   *
   * @param     {String}      name
   * @param     {Function}    callback
   * @param     {Mixed}       context
   * @chainable
   * @return    {this}
   */
  once: function(name, callback, context) {
    var once = _.runOnce(function() {
      this.off(name, once);
      callback.apply(this, arguments);
    }, this);
    once._callback = callback;
    return this.on(name, once, context);
  },

  /**
   * Turn off an event
   *
   * @param     {String}      name
   * @param     {Function}    callback
   */
  off: function(name, callback) {
    var retain;
    var ev;
    var events;
    var names;

    // No events
    if (!this._events) {
      return this;
    }

    // Turn it all off
    if (!name && !callback) {
      this._events = {};
      return this;
    }

    // Event names either the event or all of the events
    names = name ? [name] : _.keys(this._events);

    // Loop through event names
    for (var i = 0, l = names.length; i < l; i++) {
      name = names[i];
      events = this._events[name];

      if (!events) {
        // Skip if we have no events
        continue;
      }

      // Empty and refill below
      this._events[name] = retain = [];

      // If we have a callback search for it
      if (callback) {
        // Loop through individual callbacks per event
        for (var j = 0, k = events.length; j < k; j++) {
          ev = events[j];
          if (callback !== ev.callback && callback !== ev.callback._callback) {
            retain.push(ev);
          }
          ev = void 0;
        }
      }

      // No events? Delete
      if (!retain.length) {
        delete this._events[name];
      }

      retain = void 0;
    }

    return this;
  },

  /**
   * Trigger an event
   * @param  {string}   name
   * @return {this}     return this so we can chain
   */
  trigger: function(name) {
    if (!this._events) {
      return this;
    }
    var args = [].slice.call(arguments, 1);
    var events = this._events[name];

    // Dispatch
    if (events) {
      var ev;
      var i = -1;
      var l = events.length;
      while (++i < l) {
        (ev = events[i]).callback.apply(ev.ctx, args);
      }
    }

    return this;
  }
};
