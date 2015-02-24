/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 *      https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

  grunt.config.set('watch', {

    grunt: {
      // Grunt Files
      files: ['Gruntfile.js', 'tasks/**/*.js'],

      // Automatically reload Grunt configuration
      options: {
        reload: true
      }
    },

    livereload: {
      files: 'Amber.js',
      options: {
        livereload: true
      }
    },

    src: {
      options: {
        start: true
      },

      files: ['src/**/*.js', 'test/specs/**/*.js'],

      tasks: ['webpack', 'karma:watch:run', 'jshint']
    }

  });

};
