var Supports = require('../../src/modules/supports');

describe("modules/", function() {

  it("should detect svg support", function() {
    expect(Supports.svg).toBeDefined();
    expect(typeof Supports.svg).toBe('boolean');
    expect(Supports.svg).toEqual(Modernizr.svg);
  });

  it("should detect draganddrop support", function() {
    expect(Supports.draganddrop).toBeDefined();
    expect(typeof Supports.draganddrop).toBe('boolean');
    expect(Supports.draganddrop).toEqual(Modernizr.draganddrop);
  });

  it("should detect touch support", function() {
    expect(Supports.touch).toBeDefined();
    expect(typeof Supports.touch).toBe('boolean');
    expect(Supports.touch).toEqual(Modernizr.touch);
  });


  it("should detect cssanimations support", function() {
    expect(Supports.cssanimations).toBeDefined();
    expect(typeof Supports.cssanimations).toBe('boolean');
    expect(Supports.cssanimations).toEqual(Modernizr.cssanimations);
  });

  it("should detect animationframes support", function() {
    expect(Supports.animationframes).toBeDefined();
    expect(typeof Supports.animationframes).toBe('boolean');
  });

});
