module.exports = function(grunt) {
  grunt.registerTask('hint', [
    'jshint',
    'jscs'
  ]);
};
