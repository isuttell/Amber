/**
 * Webpack
 *
 * ---------------------------------------------------------------
 *
 * Module loader
 *
 * For usage docs see:
 *    https://github.com/webpack/grunt-webpack
 */
module.exports = function(grunt) {

  grunt.config.set('webpack', {
    Amber: {
      entry: './src/index.js',
      output: {
        path: './',
        filename: 'Amber.js',
        libraryTarget: 'umd',
        library: 'Amber'
      },
      externals: {
        'jquery' : "jQuery"
      },
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
    }
  });

};
