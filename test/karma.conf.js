module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'test/vendor/**/*.js',
      'test/specs/**/*.js'
    ],

    preprocessors: {
      'test/specs/**/*.js': ['webpack']
    },

    webpack: {
      stats: false,
      progess: false,
      profile: false,
      externals: {
        'jquery': "jQuery"
      },
      module: {
        postLoaders: [{
          test: /\.js$/,
          exclude: /(test|node_modules|bower_components)\//,
          loader: 'istanbul-instrumenter'
        }]
      },
    },

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
      'karma-html-reporter',
      'karma-webpack'
    ],

    coverageReporter: {
      dir: 'test/coverage/',
      reporters: [{
        type: 'html'
      }, {
        type: 'lcovonly',
        subdir: 'lcov'
      }, {
        type: 'text-summary'
      }, ]
    },

    htmlReporter: {
      outputDir: 'test/reports/',
      templatePath: __dirname + '/reportTemplate.html'
    },

    reporters: ['story', 'coverage']

  });
};
