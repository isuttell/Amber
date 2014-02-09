describe("Amber.Browser", function() {

	it("should be defined", function() {
		expect(Amber.Browser).toBeDefined();
	});

	it("should define standard browsers", function() {
		expect(Amber.Browser.iOS).toBeDefined();
		expect(Amber.Browser.iPhone).toBeDefined();
		expect(Amber.Browser.iPad).toBeDefined();
		expect(Amber.Browser.android).toBeDefined();
		expect(Amber.Browser.blackberry).toBeDefined();
		expect(Amber.Browser.iemobile).toBeDefined();
		expect(Amber.Browser.firefox).toBeDefined();
		expect(Amber.Browser.chrome).toBeDefined();
		expect(Amber.Browser.safari).toBeDefined();
		expect(Amber.Browser.ie).toBeDefined();
	});


	it("should detect mobile", function() {
		expect(Amber.Browser.mobile).toBeDefined();
	});

});