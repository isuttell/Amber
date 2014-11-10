module.exports = function(config)
{
    config.set(
    {

        basePath: '../',

        files: [
            'test/vendor/**/*.js',
            'Amber.js',
            'test/specs/**/*.js'
        ],

        autoWatch: false,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-story-reporter',
            'karma-html-reporter'
        ],

        coverageReporter:
        {
            dir: 'test/coverage/',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcovonly', subdir: 'lcov'},
                { type: 'text-summary' },
            ]
        },

        htmlReporter: {
            outputDir: 'test/reports/',
            templatePath: __dirname + '/reportTemplate.html'
        },

        reporters: ['story', 'coverage']

    });
};
