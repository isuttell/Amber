describe("Supports", function() {

	it("should be defined", function() {
		expect(Amber.$$modules.Supports).toBeDefined();
	});

	it("should detect svg support", function() {
		expect(Amber.$$modules.Supports.svg).toBeDefined();
		expect(typeof Amber.$$modules.Supports.svg).toBe('boolean');
		expect(Amber.$$modules.Supports.svg).toEqual(Modernizr.svg);
	});

	it("should detect draganddrop support", function() {
		expect(Amber.$$modules.Supports.draganddrop).toBeDefined();
		expect(typeof Amber.$$modules.Supports.draganddrop).toBe('boolean');
		expect(Amber.$$modules.Supports.draganddrop).toEqual(Modernizr.draganddrop);
	});

	it("should detect touch support", function() {
		expect(Amber.$$modules.Supports.touch).toBeDefined();
		expect(typeof Amber.$$modules.Supports.touch).toBe('boolean');
		expect(Amber.$$modules.Supports.touch).toEqual(Modernizr.touch);
	});


	it("should detect cssanimations support", function() {
		expect(Amber.$$modules.Supports.cssanimations).toBeDefined();
		expect(typeof Amber.$$modules.Supports.cssanimations).toBe('boolean');
		expect(Amber.$$modules.Supports.cssanimations).toEqual(Modernizr.cssanimations);
	});

	it("should detect animationframes support", function() {
		expect(Amber.$$modules.Supports.animationframes).toBeDefined();
		expect(typeof Amber.$$modules.Supports.animationframes).toBe('boolean');
	});

});
