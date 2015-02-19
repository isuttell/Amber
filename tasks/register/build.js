module.exports = function (grunt) {
	grunt.registerTask('build', [
    'test',
		'concat',
    'uglify'
	]);
};
