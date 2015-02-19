describe("Browser", function() {

	it("should define standard browsers", function() {
		expect(Amber.$$modules.Browser.iOS).toBeDefined();
		expect(Amber.$$modules.Browser.iPhone).toBeDefined();
		expect(Amber.$$modules.Browser.iPad).toBeDefined();
		expect(Amber.$$modules.Browser.android).toBeDefined();
		expect(Amber.$$modules.Browser.blackberry).toBeDefined();
		expect(Amber.$$modules.Browser.iemobile).toBeDefined();
		expect(Amber.$$modules.Browser.firefox).toBeDefined();
		expect(Amber.$$modules.Browser.chrome).toBeDefined();
		expect(Amber.$$modules.Browser.safari).toBeDefined();
		expect(Amber.$$modules.Browser.ie).toBeDefined();
	});


	it("should detect mobile", function() {
		Amber.$$modules.Browser.$$check('iPhone');
		expect(Amber.$$modules.Browser.mobile).toBe(true);
	});

	it("should detect IE", function() {
		Amber.$$modules.Browser.$$check('Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))');
		expect(Amber.$$modules.Browser.ie).toBeTruthy();
		expect(Amber.$$modules.Browser.ie).toBe(9);
	});

});
