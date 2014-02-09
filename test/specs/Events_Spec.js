describe("Amber.Events", function() {
	var div = document.createElement('div');

	var TestView = Amber.View.extend();

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


	it("should be able listen to events within a view", function() {
		var result = false,
			expected = true;

		view.on('test:view', function(data){
			result = data;
		});

		view.trigger('test:view', expected);

		expect(result).toBe(expected);
	});


});