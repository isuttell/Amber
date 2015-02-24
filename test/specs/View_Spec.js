describe("lib/view", function() {

  var Amber = {};
  Amber.define = require('../../src/lib/define')(Amber);
  Amber.View = require('../../src/lib/view')(Amber);

  beforeEach(function(){
    if(Amber._modules) {
      delete Amber._modules;
    }
  });

  it("should add the definition to `Amber._modules` with the extend option", function() {
    var name = 'Test';
    var deps = [];
    var fn = function(){};
    Amber.View(name, deps, fn);

    expect(Amber._modules[0]).toEqual({
      name: name,
      deps: deps,
      fn: fn,
      extend: '$view'
    });
  });

  it("should optionally not take deps with the extend option", function() {
    var name = 'Test';
    var fn = function(){};
    Amber.View(name, fn);

    expect(Amber._modules[0]).toEqual({
      name: name,
      deps: [],
      fn: fn,
      extend: '$view'
    });
  });
});
