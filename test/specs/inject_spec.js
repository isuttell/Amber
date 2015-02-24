describe("lib/define", function() {

  var Amber = {};
  Amber.inject = require('../../src/lib/inject')(Amber);

  beforeEach(function(){
    if(Amber.modules) {
      delete Amber.modules;
    }
  });

  it("should call a function with deps applied", function() {
    var fn = function(){};
    Amber.$$modules = {
      Test: fn
    };

    Amber.inject(['Test'], function(Test){
      expect(Test).toBe(fn);
    });
  });
});
