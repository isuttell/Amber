describe("lib/define", function() {

  var Amber = {};
  Amber.define = require('../../src/lib/define')(Amber);

  beforeEach(function(){
    if(Amber._modules) {
      delete Amber._modules;
    }
  });

  it("should add the definition to `Amber._modules`", function() {
    var name = 'Test';
    var deps = ['Deps'];
    var fn = function() {};
    Amber.define(name, deps, fn);

    expect(Amber._modules[0]).toEqual({
      name: name,
      deps: deps,
      fn: fn,
      extend: void 0
    });
  });

  it("should optionally not take deps", function() {
    var name = 'Test';
    var fn = function() {};
    Amber.define(name, fn);

    expect(Amber._modules[0]).toEqual({
      name: name,
      deps: [],
      fn: fn,
      extend: void 0
    });
  });
});
