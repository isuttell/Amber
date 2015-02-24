var Amber = require('../../src/index');

describe('index.js', function() {

  it('should include the version', function() {
    expect(Amber.version).toBeDefined();
  });

  it('should load the dependency injection system', function() {
    expect(Amber.define).toBeDefined();
    expect(Amber.inject).toBeDefined();
    expect(Amber.module).toBeDefined();
    expect(Amber.run).toBeDefined();
  });

  it('should include jQuery', function() {
    expect(Amber.$).toBeDefined();
  });

  it('should include any extend aliases', function(){
    expect(Amber.View).toBeDefined();
  });

  it('should bootstrap internal modules', function(){
    expect(Amber.$$modules.jQuery).toBeDefined();
    expect(Amber.$$modules.$browser).toBeDefined();
    expect(Amber.$$modules.$utilities).toBeDefined();
    expect(Amber.$$modules.$supports).toBeDefined();
    expect(Amber.$$modules.$view).toBeDefined();
    expect(Amber.$$modules.$window).toBeDefined();
  });

});
