describe("Amber.Events", function() {
	var div = document.createElement('div');

	var TestView = Amber.View.extend({
			id: 1,
			className: 'view-container',
			events: {
				'click' : 'fakeEvent',
				'click .test' : 'fakeEvent'
			},
			fakeEvent: function(){}
		});

	beforeEach(function(){
		view = new TestView();
	});

	it("should be defined", function() {
		expect(Amber.Events).toBeDefined();
	});

	it("should listen to global Events", function() {
		expect(Amber.Vent).toBeDefined();

		var triggered = false;

		Amber.Vent.on('test:global', function(){
			triggered = true;
		});

		Amber.Vent.trigger('test:global');

		expect(triggered).toBeTruthy();
	});

	it("should be able to pass data", function() {
		var result = false,
			expected = true;

		Amber.Vent.on('test:data', function(data){
			result = data;
		});

		Amber.Vent.trigger('test:data', expected);

		expect(result).toBe(expected);
	});

	it("should should return this if theres no callback", function() {
		var result = false,
			expected = true;

		view.on('test');
		view.once('test2');

		expect(typeof view._events).toBe('undefined');
	});

	it("should be able listen to events within a view", function() {
		var result = false,
			expected = true;

		view.on('test:view', function(data){
			result = data;
		});

		view.trigger('test:view', expected);

		expect(result).toBe(expected);
	});

	it("should be able to trigger multiple events at the same time", function() {
		var result = 0,
			expected = 3;

		view.on('add1', function(){
			result += 1;
		});
		view.on('add2', function(){
			result += 2;
		});

		view.trigger('add1 add2');

		expect(result).toBe(expected);
	});

	describe('once', function(){
		it("should listen to an event once", function() {
			var result = false,
				expected = true;

			view.once('test:view', function(data){
				result = data;
			});

			view.trigger('test:view', expected);
			view.trigger('test:view', false);

			expect(result).toBe(expected);
		});
	});

	describe('off', function(){
		beforeEach(function() {
			// Reset
			view.off();
		});

		it("should clear all events", function() {
			var result = false,
				expected = false;

			view.on('test:view', function(data){
				result = data;
			});

			view.off();
			view.trigger('test:view', true);

			expect(result).toBe(expected);
		});

		it("should clear one event", function() {
			var result = false,
				expected = false;

			view.on('test:view', function(data){
				result = data;
			});

			view.off('test:view');
			view.trigger('test:view', true);

			expect(result).toBe(expected);
		});
	});


	it('should delegate events', function() {
		spyOn($.fn,'on');
		view.delegateEvents();
		expect($.fn.on).toHaveBeenCalled();
	});

	it('should undelegate events', function() {
		spyOn($.fn,'off');
		view.delegateEvents();
		expect($.fn.off).toHaveBeenCalled();
	});

});
