var Browser = require('../../src/modules/browser');

describe("modules/browser", function() {

  it("should define standard browsers", function() {
    expect(Browser.iOS).toBeDefined();
    expect(Browser.iPhone).toBeDefined();
    expect(Browser.iPad).toBeDefined();
    expect(Browser.android).toBeDefined();
    expect(Browser.blackberry).toBeDefined();
    expect(Browser.iemobile).toBeDefined();
    expect(Browser.firefox).toBeDefined();
    expect(Browser.chrome).toBeDefined();
    expect(Browser.safari).toBeDefined();
    expect(Browser.ie).toBeDefined();
  });


  it("should detect mobile", function() {
    Browser.$$check('iPhone');
    expect(Browser.mobile).toBe(true);
  });

  it("should detect IE", function() {
    Browser.$$check('Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))');
    expect(Browser.ie).toBeTruthy();
    expect(Browser.ie).toBe(9);
  });

});
