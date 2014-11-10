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
		Amber.Browser.check('iPhone');
		expect(Amber.Browser.mobile).toBe(true);
	});

	it("should detect IE", function() {
		Amber.Browser.check('Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))');
		expect(Amber.Browser.ie).toBeTruthy();
		expect(Amber.Browser.ie).toBe(9);
	});

});
