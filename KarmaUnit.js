module.exports = function(config) {

    config.set({
        basePath: '',
        frameworks: ['jasmine', 'fixture'],
        files: [
            'vendor/angular/angular.js',
            'vendor/angular-mocks/angular-mocks.js',
            'project/Default.js',
            'project/controllers/*.js',
            'project/directives/*.js',
            'project/services/*.js',
            'module/Kiwi.js',
            'tests/Spec.js',
            'project/**/fixtures/*',
            'tests/**/*.Test.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Firefox', 'PhantomJS'],
        singleRun: true,
        preprocessors: {
            '**/*.html': ['html2js'],
            '**/*.json': ['html2js']
        }
    });

};