describe("Amber.Format", function() {

	it("should be defined", function() {
		expect(Amber.Format).toBeDefined();
	});

	it("should have a function to add commas to large numbers", function() {
		expect(Amber.Format.numberWithCommas).toBeDefined();

		var number = 1000,
			result = Amber.Format.numberWithCommas(number);

		expect(result).toBe('1,000');
	});

	it("should have a function to strip trailing zeros", function() {
		expect(Amber.Format.stripTrailingZero).toBeDefined();

		var number = '5.0',
			result = Amber.Format.stripTrailingZero(number);

		expect(result).toBe('5');
	});

	it("should have a function to do basic plurization", function() {
		expect(Amber.Format.basicPluralize).toBeDefined();

		var word = 'number',
			result = Amber.Format.basicPluralize('number', 2);

		expect(result).toBe('numbers');

		result = Amber.Format.basicPluralize('number', 1);

		expect(result).toBe(word);
	});

});