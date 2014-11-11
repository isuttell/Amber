describe("Amber.Format", function() {

	it("should be defined", function() {
		expect(Amber.Format).toBeDefined();
	});

	describe('numberWithCommas', function(){
		it("should have a function to add commas to large numbers", function() {
			expect(Amber.Format.numberWithCommas).toBeDefined();

			expect(Amber.Format.numberWithCommas(1000)).toBe('1,000');
			expect(Amber.Format.numberWithCommas(1000.5)).toBe('1,000.5');
			expect(Amber.Format.numberWithCommas(500)).toBe('500');
			expect(Amber.Format.numberWithCommas(500.1)).toBe('500.1');

			expect(Amber.Format.numberWithCommas(-500)).toBe('-500');
			expect(Amber.Format.numberWithCommas(1000000)).toBe('1,000,000');
		});

		it("should return the num if its not a number", function() {
			expect(Amber.Format.numberWithCommas(false)).toBe(false);
		});
	});


	describe('stripTrailingZero', function(){
		it("should have a function to strip trailing zeros", function() {
			expect(Amber.Format.stripTrailingZero).toBeDefined();

			var number = '5.0',
				result = Amber.Format.stripTrailingZero(number);

			expect(result).toBe('5');
		});

		it("should return the num if its not a number", function() {
			expect(Amber.Format.stripTrailingZero(false)).toBe(false);
		});
	});


	describe('basicPluralize', function(){
		it("should have a function to do basic plurization", function() {
			expect(Amber.Format.basicPluralize).toBeDefined();

			var word = 'number',
				result = Amber.Format.basicPluralize('number', 2);

			expect(result).toBe('numbers');

			result = Amber.Format.basicPluralize('number', 1);

			expect(result).toBe(word);
		});
	});

});
