/*****************************************************************************
 * Browser
 *
 * @file    User Agent detection
 */

'use strict';

module.exports = (function() {

  var Browser = {};
  Browser.$$check = function(userAgent) {

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
  };

  return Browser.$$check(navigator.userAgent);
})();
