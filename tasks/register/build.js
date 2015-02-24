module.exports = function (grunt) {
	grunt.registerTask('build', [
    'test',
		'webpack:build',
    'uglify'
	]);
};
