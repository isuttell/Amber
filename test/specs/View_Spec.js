var View = require('../../src/modules/view');

describe("modules/view", function() {

  var view;
  beforeEach(function() {
    view = new View();
  });

  it('should have a this.$ function', function() {
    expect(_.isFunction(view.$)).toBe(true);
    expect(view.$('.test') instanceof $).toBe(true);
  });

  it('should have a this.remove function', function() {
    expect(_.isFunction(view.remove)).toBe(true);
  });

  it('should have a this.setElement function', function() {
    expect(_.isFunction(view.setElement)).toBe(true);
  });

  /*
    |--------------------------------------------------------------------------
    | Initialize
    */

  describe("initialize function", function() {
    var div = document.createElement('div'),
      initializeCalled;

    var InitializeView = View.extend({
      init: function() {
        initializeCalled = true;
      }
    });

    beforeEach(function() {
      initializeCalled = false;

      initView = new InitializeView({
        $el: $(div),
      });
    });

    it('should have a this.initialize function', function() {
      expect(_.isFunction(initView.init)).toBe(true);
    });

    it("el should be an HTMLDivElement", function() {
      expect(initView.el instanceof HTMLDivElement).toBeTruthy();
    });

    it("$el should be an instance of $", function() {
      expect(initView.$el instanceof jQuery).toBeTruthy();
    });

    it("initialize should be called when created", function() {
      expect(initializeCalled).toBe(true);
    });

  });

  /*
    |--------------------------------------------------------------------------
    | Render
    */
  describe("render", function() {
    var div = document.createElement('div');

    var beforeRender = afterRender = false;

    var RenderView = View.extend({
      initialize: function() {

        this.on('before:render', function() {
          beforeRender = true;
        });

        this.on('after:render', function() {
          afterRender = true;
        });

        this.render();
      }
    });

    beforeEach(function() {
      renderView = new RenderView({
        $el: $(div),
        initializeOnLoad: true
      });

    });

    it('should have a this.render function', function() {
      expect(_.isFunction(renderView.render)).toBe(true);
    });

    it("should be a function", function() {
      expect(typeof renderView.render).toBe('function');
    });

    it('should have a "template" defined and a string', function() {
      expect(renderView.template).toBeDefined();
      expect(typeof renderView.template).toBe('string');
    });
  });
});
