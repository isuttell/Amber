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
