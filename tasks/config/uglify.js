/**
 * Uglify
 *
 * ---------------------------------------------------------------
 *
 * Minify everything together
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-contrib-uglify
 */
module.exports = function(grunt) {

  grunt.config.set('uglify', {
    options: {
      banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %>\n * <%= pkg.description %>\n * Contributor(s): <%= pkg.author %>\n */\n\n',
      preserveComments: 'some',
      report: 'min'
    },
    build: {
      files: {
        'Amber.min.js': ['Amber.js'],
      }
    }
  });
};
