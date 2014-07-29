module.exports = function(grunt) {

    grunt.initConfig({

        /**
         * @property pkg
         * @type {Object}
         */
        pkg: grunt.file.readJSON('package.json'),

        /**
         * @property jshint
         * @type {Object}
         */
        jshint: {
            all: 'module/Kiwi.js',
            options: {
                jshintrc: '.jshintrc'
            }
        },

        /**
         * @property karma
         * @type {Object}
         */
        karma: {
            unit: {
                configFile: 'KarmaUnit.js',
                background: false,
                browsers: ['Firefox', 'PhantomJS']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma', 'jshint']);
    grunt.registerTask('build', ['copy', 'uglify']);
    grunt.registerTask('default', ['jshint', 'karma']);

};