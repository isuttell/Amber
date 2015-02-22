describe("Utilities", function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toEqualData: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            var result = {};

            var data = {};
            for (var i in expected) {
              if (actual.hasOwnProperty(i)) {
                data[i] = actual[i];
              }
            }

            result.pass = _.isEqual(data, expected);

            return result;
          }
        };
      }
    });
  });

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

    describe('isObject', function() {
      it('should check if a variable is a object', function() {
        for (var test in tests) {
          expect(Amber.$$modules.Utilities.isObject(tests[test])).toBe(test === 'obj');
        }
      });
    });

    describe('isFunction', function() {
      it('should check if a variable is a function', function() {
        for (var test in tests) {
          expect(Amber.$$modules.Utilities.isFunction(tests[test])).toBe(test === 'fn');
        }
      });
    });

    describe('isString', function() {
      it('should check if a variable is a String', function() {
        for (var test in tests) {
          expect(Amber.$$modules.Utilities.isString(tests[test])).toBe(test === 'str');
        }
      });
    });

    describe('isIterable', function() {
      it('should check if a variable is a String', function() {
        expect(Amber.$$modules.Utilities.isIterable(tests.fn)).toBe(true);
        expect(Amber.$$modules.Utilities.isIterable(tests.obj)).toBe(true);
        expect(Amber.$$modules.Utilities.isIterable(tests.nl)).toBe(false);
        expect(Amber.$$modules.Utilities.isIterable(tests.undef)).toBe(false);
        expect(Amber.$$modules.Utilities.isIterable(tests.str)).toBe(false);
        expect(Amber.$$modules.Utilities.isIterable(tests.arr)).toBe(false);
      });
    });

    describe('runOnce', function() {
      it('should run a function once', function() {
        var counter = 0;
        var func = Amber.$$modules.Utilities.runOnce(function() {
          counter++;
        });

        func();
        func();

        expect(counter).toBe(1);
      });

      it('should throw an error if it\'s not a function', function() {
        expect(function() {
          var func = Amber.$$modules.Utilities.runOnce({});
        }).toThrow(new Error('fn isn\'t a function'));
      });

    });

    describe('assign/extend', function() {
      it('should extend an object with another object', function() {
        var expected = {
          one: true,
          two: true
        };

        var obj1 = {
          one: true
        };
        var obj2 = {
          two: true
        };

        var result = Amber.$$modules.Utilities.assign(obj1, obj2);

        expect(result).toEqual(expected);

      });

      it('should extend an object with multiple other objects', function() {
        var expected = {
          one: true,
          two: true,
          three: true
        };

        var obj1 = {
          one: true
        };
        var obj2 = {
          two: true
        };
        var obj3 = {
          three: true
        };

        var result = Amber.$$modules.Utilities.assign(obj1, obj2, obj3);

        expect(result).toEqual(expected);
      });

      it('should overrite exisiting properties', function() {
        var expected = {
          one: true,
          two: true,
          three: true
        };

        var obj1 = {
          one: true,
          two: false,
          three: false
        };
        var obj2 = {
          two: true
        };
        var obj3 = {
          three: true
        };

        var result = Amber.$$modules.Utilities.assign(obj1, obj2, obj3);

        expect(result).toEqual(expected);
      });

      it('should return the object if it is not an object', function() {
        var expected = true;

        var obj1 = true;

        var obj2 = {
          two: true
        };
        var obj3 = {
          three: true
        };

        var result = Amber.$$modules.Utilities.assign(obj1, obj2, obj3);

        expect(result).toEqual(expected);
      });

      it('should extend a function', function() {
        var expected = {
          one: true,
          two: true
        };

        var ExampleObject = function() {};

        var func = new ExampleObject();

        func.one = true;

        var obj = {
          two: true
        };

        var result = Amber.$$modules.Utilities.assign(func, obj);

        expect(result).toEqualData(expected);
      });

      it('should ignore not own properties', function() {
        var expected = {
          one: true,
          two: true
        };

        var ExampleObject = function() {};

        var func = new ExampleObject();

        ExampleObject.prototype.three = false;

        func.one = true;

        var obj = {
          two: true
        };

        var result = Amber.$$modules.Utilities.assign(func, obj);

        expect(result).toEqualData(expected);
      });

    });

    describe('keys', function() {
      it('should return an array of keys of an object', function() {
        var expected = ['one', 'two'];

        var obj = {
          one: true,
          two: true
        };

        var result = Amber.$$modules.Utilities.keys(obj);

        expect(result).toEqual(expected);
        expect(result instanceof Array).toBe(true);
      });

      it('should return the object if it is not an object', function() {
        var expected = true;

        var obj = true;

        var result = Amber.$$modules.Utilities.keys(obj);

        expect(result).toEqual(expected);
      });

    });

    describe('results', function() {

      var testObject, _this, args;

      beforeEach(function() {
        _this = void 0;
        args = void 0;

        testObject = {
          str: 'str',
          num: 100,
          fn: function() {
            args = arguments;
            _this = this;
            return 50;
          }
        };
      });


      it('should return return a basic value from an object', function() {
        expect(Amber.$$modules.Utilities.results(testObject, 'str')).toBe(testObject.str);
        expect(Amber.$$modules.Utilities.results(testObject, 'num')).toBe(testObject.num);
      });

      it('should return `undefined` when a value isn\'t found', function() {
        expect(typeof Amber.$$modules.Utilities.results(testObject, 'undef')).toBe('undefined');
      });

      it('should return the value of the first argument if it is not an object', function() {
        expect(Amber.$$modules.Utilities.results('str')).toBe('str');
      });

      it('should return the result of a function', function() {
        expect(Amber.$$modules.Utilities.results(testObject, 'fn')).toBe(testObject.fn.call());
      });

      it('should apply `this` context', function() {
        var testValue = 10;
        Amber.$$modules.Utilities.results(testObject, 'fn', {
          mockThis: testValue
        });
        expect(_this.mockThis).toBe(testValue);
      });

      it('should apply additional args', function() {
        var testValue = 25;
        Amber.$$modules.Utilities.results(testObject, 'fn', {}, testValue);
        expect(args[0]).toBe(testValue);
      });
    });
  });
});
