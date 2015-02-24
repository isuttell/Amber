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
    options: {
      entry: './src/index.js',
      profile: true,
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
    },
    build: {
      profile: false,
      stats: false
    },
    dev: {
      profile: true,
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
    }
  });

};
