// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/modernizr/modernizr.js',
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular/angular.js',
      
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
    'app/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js',      
      
      
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      
    'app/bower_components/angular-translate/angular-translate.js',
    'app/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'app/bower_components/spin.js/spin.js',
    'app/bower_components/angular-spinner/angular-spinner.js',
    'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'app/bower_components/angular-ui-utils/ui-utils.js',
    'app/bower_components/underscore/underscore.js',
    'app/bower_components/angular-debounce/dist/angular-debounce.js',     
      
      'app/scripts/*.js',
      'app/scripts/libs/jquery.plugin.js',
      'app/scripts/libs/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
