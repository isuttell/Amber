describe("Amber.Supports", function() {

	it("should be defined", function() {
		expect(Amber.Supports).toBeDefined();
	});

	it("should detect svg support", function() {
		expect(Amber.Supports.svg).toBeDefined();
		expect(typeof Amber.Supports.svg).toBe('boolean');
		expect(Amber.Supports.svg).toEqual(Modernizr.svg);
	});

	it("should detect draganddrop support", function() {
		expect(Amber.Supports.draganddrop).toBeDefined();
		expect(typeof Amber.Supports.draganddrop).toBe('boolean');
		expect(Amber.Supports.draganddrop).toEqual(Modernizr.draganddrop);
	});

	it("should detect touch support", function() {
		expect(Amber.Supports.touch).toBeDefined();
		expect(typeof Amber.Supports.touch).toBe('boolean');
		expect(Amber.Supports.touch).toEqual(Modernizr.touch);
	});


	it("should detect cssanimations support", function() {
		expect(Amber.Supports.cssanimations).toBeDefined();
		expect(typeof Amber.Supports.cssanimations).toBe('boolean');
		expect(Amber.Supports.cssanimations).toEqual(Modernizr.cssanimations);
	});

	it("should detect animationframes support", function() {
		expect(Amber.Supports.animationframes).toBeDefined();
		expect(typeof Amber.Supports.animationframes).toBe('boolean');
	});

});