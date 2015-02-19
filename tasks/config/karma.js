/**
 * Karma Jasmine Tests
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 *      https://github.com/karma-runner/grunt-karma
 */
module.exports = function(grunt) {

  grunt.config.set('karma', {
    options: {
      configFile: 'test/karma.conf.js',
      browsers: ['PhantomJS']
    },
    single: {
      options: {
        singleRun: true,
        logLevel: 'INFO'
      }
    },
    watch: {
      options: {
        background: true,
        logLevel: 'DEBUG'
      }
    }
  });

};
