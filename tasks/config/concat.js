/**
 * Concat
 *
 * ---------------------------------------------------------------
 *
 * Concats js files together
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function(grunt) {

  grunt.config.set('concat', {
    dev: {
      src: [
        'src/inc/_header.js',
        'src/define.js',
        'src/utilities.js',
        'src/extend.js',
        'src/view.js',
        'src/supports.js',
        'src/browser.js',
        'src/inject.js',
        'src/jquery.js',
        'src/window.js',
        'src/run.js',
        'src/inc/_footer.js',
      ],
      dest: 'Amber.js'
    }
  });

};
