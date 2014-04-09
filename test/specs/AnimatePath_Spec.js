describe("Amber.AnimatePath", function ()
{

    /*--------------------------------------------------------------------------
    | Polyfill for testing requestAnimationFrame
    */
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
    {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
    {
        window.requestAnimationFrame = function (callback, element)
        {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function ()
                {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame)
    {
        window.cancelAnimationFrame = function (id)
        {
            clearTimeout(id);
        };
    }

    /*--------------------------------------------------------------------------
    | Actual Tests
    */

    var callbackCalled = false;

    beforeEach(function (done)
    {
        var testPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        testPath.setAttributeNS(null, "d", "M 1,97.857143 C 19.285714,96.428571 24.016862,131.64801 90.714286,132.85714 140.78762,133.7649 202.79376,66.16041 202.79376,66.16041");

        // Only run for 2 frames since each frame takes ~16ms due to polyfill
        Amber.AnimatePath.byFrameCount(testPath, 2, function ()
        {
            callbackCalled = true;
            done();
        });
    });

    it("should be defined", function (done)
    {
        expect(Amber.AnimatePath).toBeDefined();
        done();
    });

    describe("byFrameCount", function ()
    {
        it("should be defined", function (done)
        {
            expect(Amber.AnimatePath.byFrameCount).toBeDefined();
            done();
        });

        it("should call run the callback when specified", function (done)
        {
            expect(callbackCalled).toBe(true);
            done();
        });
    });

});