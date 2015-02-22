  /*****************************************************************************
   * Events
   *
   * @file    Pub/sub module
   */

  Amber.define('Events', ['Utilities'], function(_) {

    return {
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
        if(!callback) {
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

        if (!this._events) {
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

  });
