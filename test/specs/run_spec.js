describe('lib/run', function() {

  var Amber = {};
  Amber.define = require('../../src/lib/define')(Amber);
  Amber.run = require('../../src/lib/run')(Amber);
  Amber.inject = require('../../src/lib/inject')(Amber);
  Amber.View = require('../../src/lib/view')(Amber);

  beforeEach(function(){
    if(Amber.$$modules) {
      delete Amber.$$modules;
    }
    Amber.$$modules = {
      '$view' : require('../../src/modules/view.js'),
      'Test': 'test'
    }
  });

  it('should load any module definitions', function() {
    var name = 'NewModule';
    var fn = function() { return true; };
    Amber.define(name, fn);

    expect(Amber.$$modules[name]).toBeUndefined();

    Amber.run();

    expect(Amber.$$modules[name]).toBeDefined();
  });

  it('should load modules in any order', function() {
    var fn = function() { return 1; };
    var fn2 = function() { return 2; };
    var fn3 = function() { return 3; };

    Amber.define('NewModule3', ['NewModule2'], fn3);
    Amber.define('NewModule', ['Test'], fn);
    Amber.define('NewModule2', ['NewModule'], fn2);

    console.log(Amber._modules);

    Amber.run(['NewModule', 'NewModule2', 'NewModule3'], function(NewModule, NewModule2, NewModule3){
      expect(NewModule).toBe(1);
      expect(NewModule2).toBe(2);
      expect(NewModule3).toBe(3);
    });
  });

  it('should run an callback if supplied', function(){
    var t = {
      fn: function() {}
    };
    spyOn(t, 'fn');
    Amber.run(t.fn);
    expect(t.fn).toHaveBeenCalled();
  });

  it('should extend a `$view` if definition `extend` property set to `$view`', function() {
    var name = 'TestView';
    var expected = true;
    var fn = function(){
      return {
        assigned: expected
      }
    };
    Amber.View(name, fn);

    Amber.run([name], function(TestView){
      expect(TestView.prototype.assigned).toBe(expected);
    });
  });

  describe('errors', function(){
    it('should throw an error if it can not find a module name', function(){
      var fn = function() { return 1; };
      Amber.define('Test', ['BadName'], fn);
      expect(function(){ Amber.run(); }).toThrow(new Error('Unable to find module: BadName'));
    });
  })

});
