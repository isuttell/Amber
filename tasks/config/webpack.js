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

  var webpack = require('webpack');
  var pkg = grunt.file.readJSON('package.json');
  var banner =  pkg.name+ ' v' + pkg.version+ ' - <' + pkg.homepage + '>\n' + pkg.description + '\nContributor(s): ' + pkg.author;

  grunt.config.set('webpack', {
    options: {
      entry: './src/index.js',
      output: {
        path: './',
        libraryTarget: 'umd',
        library: 'Amber'
      },
      externals: {
        'jquery': 'jQuery'
      }
    },
    build: {
      profile: false,
      stats: false,
      output: {
        filename: 'Amber.min.js',
      },
      devtool: 'source-map',
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.BannerPlugin(banner, {})
      ]
    },
    dev: {
      output: {
        filename: 'Amber.js',
      },
      profile: true,
      stats: {
        colors: true,
        modules: true,
        reasons: true
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.BannerPlugin(banner, {})
      ]
    }
  });

};
