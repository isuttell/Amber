module.exports = function (grunt)
{
    // Project configuration.
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        uglify:
        {
            options:
            {
                banner: '/*!\n * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.homepage %>\n * <%= pkg.description %>\n * Contributor(s): <%= pkg.author %>\n */\n\n',
                preserveComments: 'some',
                report: 'min'
            },
            build:
            {
                files:
                {
                    'Amber.min.js': ['Amber.js'],
                }
            }
        },
        jshint:
        {
            options:
            {
                jshintrc: true
            },
            Amber: ['Amber.js'],
            tests: ['test/specs/**/*.js'],
            grunt: ['Gruntfile.js']
        },
        jasmine:
        {
            build:
            {
                src: 'Amber.js',
                options:
                {
                    specs: 'test/specs/*Spec.js',
                    vendor: 'test/vendor/*.js'
                }
            }
        }
    });

    // Automatically load all tasks
    require('load-grunt-tasks')(grunt);

    /*
	|--------------------------------------------------------------------------
	| Tasks
	|--------------------------------------------------------------------------
	|
	*/

    grunt.registerTask('lint', ['jshint:Amber']);
    grunt.registerTask('test', ['lint', 'jasmine']);

    grunt.registerTask('build', ['test', 'uglify']);
    grunt.registerTask('default', ['build']);
};