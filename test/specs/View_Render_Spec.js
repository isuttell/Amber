describe("Amber.View.render", function() {
	var div = document.createElement('div');

	var beforeRender = afterRender = false;

	var TestView = Amber.View.extend({
		initialize: function(){

			this.on('before:render', function(){
				beforeRender = true;
			});

			this.on('after:render', function(){
				afterRender = true;
			});

			this.render();
		}
	});

	beforeEach(function(){
		view = new TestView({
			$el: $(div),
			initializeOnLoad: true
		});

	});

	it("should be defined", function() {
		expect(view.render).toBeDefined();
	});

	it("should be a function", function() {
		expect(typeof view.render).toBe('function');
	});

	it('should by default trigger the event "after:render"', function(){
		expect(afterRender).toBeTruthy();
	});

	it('should by default trigger the event "before:render"', function(){
		expect(beforeRender).toBeTruthy();
	});

	it('should have a "template" defined and a string', function(){
		expect(view.template).toBeDefined();
		expect(typeof view.template).toBe('string');
	});
});