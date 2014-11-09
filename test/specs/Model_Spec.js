xdescribe("Amber.Model", function() {
    var TestModel = Amber.Model.extend({
        defaults: {
            test: false,
            defaultProperty: true
        }
    });

    var model,
        eventResponses = {};

    beforeEach(function(done) {
        // Reset Model
        eventResponses.sync = false;
        eventResponses.success = false;
        eventResponses.error = false;
        eventResponses.complete = false;

        model = new TestModel({}, {
            url: 'test/test.json'
        });

        model.on('sync', function() {
            eventResponses.sync = true;
        });

        model.fetch({
            success: function() {
                eventResponses.success = true;
            },
            error: function() {
                eventResponses.error = true;
            },
            complete: function() {
                eventResponses.complete = true;
                done();
            }
        });
    });

    it("should be defined", function() {
        expect(Amber.Model).toBeDefined();
    });

    it("should fetch a model using an ajax call", function(done) {
        expect(_.size(model.attributes)).toBeGreaterThan(0);
        done();
    });

    it('should run the "success" callback upon fetch', function(done) {
        expect(eventResponses.success).toBe(true);
        expect(eventResponses.error).toBe(false);
        done();
    });

    it('should always run the "complete" callback upon fetch', function(done) {
        expect(eventResponses.complete).toBe(true);
        done();
    });

    it('should have a "get" function to pull a specific attribute', function(done) {
        expect(model.get('test')).toBe(true);
        done();
    });

    it('should have a "has" function to check if an attribute exists', function(done) {
        expect(model.has('test')).toBe(true);
        expect(model.has('undefinedAttribute')).toBe(false);
        done();
    });

    it('should trigger the "sync" model event upon successful fetch', function(done) {
        expect(eventResponses.sync).toBe(true);
        done();
    });

    it('should have a "toJSON" function that returns all the attributes', function(done) {
        expect(typeof model.toJSON).toBe("function");

        var data = model.toJSON();
        expect(typeof data).toBe("object");
        expect(data.test).toBe(true);
        expect(_.size(data)).toBe(_.size(model.attributes));

        done();
    });

    it('should use "defaults" object when a value is not found', function(done) {
        expect(model.get('test')).toBe(true);
        expect(model.get('defaultProperty')).toBe(true);
        done();
    });

    it('should be able to "set" a key/value pair', function(done) {
        model.set('settable', true);
        expect(model.get('settable')).toBe(true);
        done();
    });

    it('should be able to "set" a object', function(done) {
        model.set({
            'settable': true
        });
        expect(model.get('settable')).toBe(true);
        done();
    });

    it('should be able to "unset" a value', function(done) {
        model.unset('defaultProperty');
        expect(model.has('defaultProperty')).toBe(false);
        done();
    });

    it('should be able to clear all attributes', function(done) {
        model.clear();
        expect(_.size(model.attributes)).toBe(0);
        done();
    });


    describe("errors", function() {
        var TestModel = Amber.Model.extend();

        var model,
            eventResponses = {};

        beforeEach(function(done) {
            // Reset Model
            eventResponses.sync = false;
            eventResponses.success = false;
            eventResponses.error = false;
            eventResponses.complete = false;

            model = new TestModel({}, {
                url: 'test/error.json'
            });

            model.on('sync', function() {
                eventResponses.sync = true;
            });

            model.fetch({
                success: function() {
                    eventResponses.success = true;
                },
                error: function() {
                    eventResponses.error = true;
                },
                complete: function() {
                    eventResponses.complete = true;
                    done();
                }
            });
        });

        it('should run the "error" callback upon fetch', function(done) {
            expect(eventResponses.success).toBe(false);
            expect(eventResponses.error).toBe(true);
            done();
        });

        it('should always run the "complete" callback upon fetch', function(done) {
            expect(eventResponses.complete).toBe(true);
            done();
        });

        it('should not trigger the "sync" model event upon an unsuccessful fetch', function(done) {
            expect(eventResponses.sync).toBe(false);
            done();
        });

    });

});
