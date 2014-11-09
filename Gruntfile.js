module.exports = function (grunt)
{

    // Track the time of each task
    require('time-grunt')(grunt);

    // Lazy Load
    require('jit-grunt')(grunt);

    // Project configuration.
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            Amber: {
                files: ['Amber.js', 'test/specs/**/*.js'],
                tasks: ['karma:watch:run', 'jscs', 'lint']
            },
            options: {
                start: true,
                interrupt: true // Interrupt any running tasks on save
            }
        },
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
        jscs: {
            options: {
              config: ".jscsrc"
            },
            sol: {
              files: {
                src: ["Amber.js"]
              }
            }
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
        },
        karma: {
            options:
            {
                configFile: 'test/karma.conf.js',
                separator: '',
                preprocessors:
                {
                    'Amber.js': 'coverage'
                },
            },
            build:
            {
                options:
                {
                    singleRun: true,
                    browsers: ['PhantomJS'],
                    logLevel: 'ERROR',
                    reporters: ['story', 'coverage']
                }
            },
            watch:
            {
                options:
                {
                    background: true,
                    browsers: ['PhantomJS'],
                    logLevel: 'ERROR',
                    reporters: ['dots', 'html', 'coverage']
                }
            }
        }
    });

    /*
	|--------------------------------------------------------------------------
	| Tasks
	|--------------------------------------------------------------------------
	|
	*/

    grunt.registerTask('lint', ['jshint:Amber']);
    grunt.registerTask('test', ['lint', 'karma']);

    grunt.registerTask('build', ['test', 'uglify']);
    grunt.registerTask('default', ['karma:watch:start', 'watch']);
};
