module.exports = function (grunt) {
	grunt.registerTask('build', [
    'test',
		'webpack:dev',
    'webpack:build'
	]);
};
