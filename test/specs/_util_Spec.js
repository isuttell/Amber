describe("_util", function() {

    describe('Type checks', function() {

        // Types to check againse
        var tests = {
          fn: function() {},
          nl: null,
          undef: void 0,
          undef2: undefined,
          arr: [],
          obj: {},
          str: ''
        };

        describe('isString', function() {
            it('should check if a variable is a object', function() {
                for(var test in tests) {
                    expect(Amber._util.isObject(tests[test])).toBe(test === 'obj');
                }
            });
        });

        describe('isString', function() {
            it('should check if a variable is a String', function() {
                for(var test in tests) {
                    expect(Amber._util.isString(tests[test])).toBe(test === 'str');
                }
            });
        });
    });
});
