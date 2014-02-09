module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
				preserveComments: 'some',
				report: 'min',
			},
			build: {
				files: {
					'Amber.min.js': ['Amber.js'],
				}
			}
		},
		jshint: {
			Amber: ['Amber.js'],
			tests: ['test/specs/**/*.js']
		},
		jasmine: {
			build: {
				src: 'Amber.js',
				options: {
					specs: 'test/specs/*Spec.js',
					vendor: 'test/vendor/*.js'
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	/*
	|--------------------------------------------------------------------------
	| Tasks
	|--------------------------------------------------------------------------
	|
	*/

	// Default - First compiles/concats css/js then watches for changes
	grunt.registerTask('default', ['jshint:Amber', 'jasmine', 'uglify']);


	grunt.registerTask('test', ['jshint:Amber', 'jasmine']);

	grunt.registerTask('build', ['jasmine', 'uglify']);


};