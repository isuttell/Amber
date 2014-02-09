describe("Amber.View.initialize", function() {
	var div = document.createElement('div');

	var TestView = Amber.View.extend();

	beforeEach(function(){

		view = new TestView({
			$el: $(div),
		});

		spyOn(view, 'initialize');

		view.initialize();
	});

	it("el should be an HTMLDivElement", function() {
		expect(view.el instanceof HTMLDivElement).toBeTruthy();
	});

	it("initialize should be called", function() {
		expect(view.initialize).toHaveBeenCalled();
	});

});