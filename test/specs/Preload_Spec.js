xdescribe("Preload", function() {

  describe("string input", function() {
    beforeEach(function(done) {
      completed = false;
      Amber.$$modules.Preload('lorempixel.jpg', {
        done: function(images) {
          completed = true;
          done();
        }
      });
    });

    it('should accept a single url string', function(done) {
      expect(completed).toBe(true);
      done();
    });
  });

  describe("array input", function() {
    beforeEach(function(done) {
      completed = false;
      Amber.$$modules.Preload(['lorempixel.jpg', 'lorempixel.jpg'], {
        done: function(images) {
          completed = true;
          done();
        }
      });
    });

    it('should accept an array of urls', function(done) {
      expect(completed).toBe(true);
      done();
    });
  });

  describe("options.progress(percent, current, total)", function() {
    var progressTriggered,
      images,
      percents,
      currents,
      totals;

    beforeEach(function(done) {
      images = ['lorempixel.jpg', 'lorempixel.jpg', 'lorempixel.jpg'];

      progressTriggered = 0;

      percents = [];
      currents = [];
      totals = [];

      Amber.$$modules.Preload(images, {
        progress: function(percent, current, total) {
          percents.push(percent);
          currents.push(current);
          totals.push(total);

          progressTriggered++;
        },
        done: function(images) {
          done();
        }
      });
    });

    it('should when specified run the progress callback', function(done) {
      expect(progressTriggered).toBeGreaterThan(0);
      done();
    });

    it('should run the progress callback the same amount of times as images ', function(done) {
      expect(progressTriggered).toBe(images.length);
      done();
    });

    describe('percent argument', function() {
      it('should be >= 0 and <= 1', function(done) {
        expect(_.max(percents)).toBe(1);
        expect(_.min(percents)).toBeGreaterThan(0);
        done();
      });
    });

    describe('current argument', function() {
      it('should be equal to the index + 1', function(done) {
        var result;
        _.each(currents, function(value, index) {
          if (value === (index + 1) && result !== false) {
            result = true;
          } else {
            result = false;
          }
        });

        expect(result).toBe(true);
        done();
      });
    });

    describe('total argument', function() {
      it('should be equal to the total amount of images', function(done) {
        var result;
        _.each(totals, function(value) {
          if (value === images.length && result !== false) {
            result = true;
          } else {
            result = false;
          }
        });
        expect(result).toBe(true);
        done();
      });
    });

  });

  describe("options.done(images)", function() {
    var doneTriggered,
      returnedImages;

    beforeEach(function(done) {
      doneTriggered = false;
      returnedImages = void 0;
      Amber.$$modules.Preload(['lorempixel.jpg', 'lorempixel.jpg'], {
        done: function(images) {
          doneTriggered = true;
          returnedImages = images;
          done();
        }
      });
    });

    it('should when specified run the "done" callback after all images are loaded', function(done) {
      expect(doneTriggered).toBe(true);
      done();
    });

    it('should return an array of HTMLImageElement objects', function(done) {
      expect(_.isArray(returnedImages)).toBe(true);
      var result;
      _.each(returnedImages, function(image) {
        if (result !== false) {
          result = image instanceof HTMLImageElement;
        }
      });
      expect(result).toBe(true);
      done();
    });
  });

  describe("isImageLoaded", function() {
    it('should return false if image is not complete', function() {
      var img = {
        complete: false
      };

      expect(Amber.$$modules.Preload.isImageLoaded(img)).toBe(false);
    });

    it('should return true if image is complete', function() {
      var img = {
        complete: true
      };

      expect(Amber.$$modules.Preload.isImageLoaded(img)).toBe(true);
    });

    it('should return false natural width is 0', function() {
      var img = {
        complete: true,
        naturalWidth: 0
      };
      expect(Amber.$$modules.Preload.isImageLoaded(img)).toBe(false);
    });
  });
});
