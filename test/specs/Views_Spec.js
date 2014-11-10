describe("Amber.Views", function() {

	var TestView = Amber.View.extend();

	beforeEach(function(){
		Amber.Views._clear();
	});

	it("should be defined", function() {
		expect(Amber.Views).toBeDefined();
	});

	it('should clear all views', function(){
		var view = new TestView();
		Amber.Views._clear();
		expect(Amber.Views._views.length).toBe(0);
	});

	it('should remove one view', function(){
		var view = new TestView();
		var view2 = new TestView();
		Amber.Views._clear(view.cid);
		expect(Amber.Views._views.length).toBe(1);
	});

	it("should store a list of views", function() {
		var view = new TestView();

		expect(Amber.Views._views.length).toBeGreaterThan(0);
	});

	it('should be able to search by cid', function(){
		var view = new TestView();

		var result = Amber.Views.get(view.cid);

		expect(result.cid).toBe(view.cid);
	});

	it('should return a list of all views', function() {
		var views = [];
		for(var x = 0; x < 5; x++) {
			views.push(new TestView());
		}

		var results = Amber.Views.all().length;
		expect(results).toBe(views.length);

	});

});
