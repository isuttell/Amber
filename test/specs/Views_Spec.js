describe("Amber.Views", function() {

	var TestView = Amber.View.extend();


	it("should be defined", function() {
		expect(Amber.Views).toBeDefined();
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

});