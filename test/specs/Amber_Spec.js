var Amber = require('../../src/index');

describe("index.js", function() {

  it("should include the version", function() {
    expect(Amber.version).toBeDefined();
  });

  it("should load the dependency injection system", function() {
    expect(Amber.define).toBeDefined();
    expect(Amber.inject).toBeDefined();
    expect(Amber.module).toBeDefined();
    expect(Amber.run).toBeDefined();
  });

  it("should include jQuery", function() {
    expect(Amber.$).toBeDefined();
  });

});
