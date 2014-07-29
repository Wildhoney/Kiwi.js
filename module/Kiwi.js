/**
 * @module Kiwi
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Kiwi.js
 */
(function Kiwi($window) {

    "use strict";

    /**
     * Responsible for loading a fixture based on the template path.
     *
     * @param pathTemplate {String}
     * @param name {String}
     * @return {Object}
     */
    var loadFixture = function loadFixture(pathTemplate, name) {

        var path = '';

        inject(function inject($interpolate) {
            path = $interpolate(pathTemplate)({ name: name });
        });

        return $window.JSON.parse($window.__html__[path]);

    };

    /**
     * @property kiwi
     * @type {Object}
     */
    $window.kiwi = {

        /**
         * @property controller
         * @type {Object}
         */
        controller: {

            /**
             * @property pathTemplate
             * @type {String}
             */
            pathTemplate: 'tests/controllers/fixtures/{{name}}.json',

            /**
             * @method create
             * @param name {String}
             * @param [dependencies={}] {Object}
             * @return {Object}
             */
            create: function create(name, dependencies) {

                var scope = {};

                inject(function inject($rootScope, $controller) {

                    dependencies = dependencies || {};

                    // Create an empty dependencies object if none has been passed in, and then add the scope
                    // property to the dependency object. We can then instantiate the controller.
                    scope = $rootScope.$new();
                    dependencies.$scope = scope;
                    $controller(name, dependencies);

                });

                return scope;

            },

            /**
             * @method path
             * @param pathTemplate {String}
             * @return {void}
             */
            path: function path(pathTemplate) {
                this.pathTemplate = pathTemplate;
            },

            /**
             * @method fixture
             * @param name {String}
             * @return {Object}
             */
            fixture: function fixture(name) {
                return loadFixture(this.pathTemplate, name);
            }

        },

        /**
         * @property service
         * @type {Object}
         */
        service: {

            /**
             * @property pathTemplate
             * @type {String}
             */
            pathTemplate: 'tests/services/fixtures/{{name}}.json',

            /**
             * @method path
             * @param pathTemplate {String}
             * @return {void}
             */
            path: function path(pathTemplate) {
                this.pathTemplate = pathTemplate;
            },

            /**
             * @method fixture
             * @param name {String}
             * @return {Object}
             */
            fixture: function fixture(name) {
                return loadFixture(this.pathTemplate, name);
            }

        },

        /**
         * @property directive
         * @type {Object}
         */
        directive: {

            /**
             * @property pathTemplate
             * @type {String}
             */
            pathTemplate: 'tests/directives/fixtures/{{name}}.html',

            /**
             * @method create
             * @param name {String}
             */
            create: function create(name) {

                var directive = '', isolatedScope = false,
                    path      = '', pathTemplate  = this.pathTemplate;

                inject(function inject($interpolate) {
                    path = $interpolate(pathTemplate)({ name: name });
                });

                var html = $window.__html__[path];

                inject(function inject($rootScope, $compile) {

                    var scope = $rootScope.$new();
                    directive = $compile(html)(scope);
                    scope.$digest();

                    // Determine if the directive is an isolated scope as defined by {}.
                    isolatedScope = !!(directive.hasClass('ng-isolate-scope'));

                });

                return {

                    /**
                     * @property scope
                     * @type {Object}
                     */
                    scope: !isolatedScope ? directive.scope() : directive.scope().$$childHead,

                    /**
                     * @property html
                     * @type {String}
                     */
                    html: directive

                }

            },

            /**
             * @method path
             * @param pathTemplate {String}
             * @return {void}
             */
            path: function path(pathTemplate) {
                this.pathTemplate = pathTemplate;
            }

        },

        /**
         * @property http
         * @type {Object}
         */
        http: {

            /**
             * @method when
             * @param method {String}
             * @param path {String}
             * @return {$httpBackend}
             */
            when: function when(method, path) {

                var httpBackend = {};

                inject(function inject($httpBackend) {
                    httpBackend = $httpBackend;
                });

                return httpBackend.when(method.toUpperCase(), path);

            },

            /**
             * @method expect
             * @param method {String}
             * @param path {String}
             * @param headers {Function}
             * @return {$httpBackend}
             */
            expect: function expect(method, path, headers) {

                var httpBackend = {};

                inject(function inject($httpBackend) {
                    httpBackend = $httpBackend;
                });

                return httpBackend.expect(method.toUpperCase(), path, headers);

            }

        },

        /**
         * Responsible for mimicking the behaviour of the latest Jasmine release where the `done` variable
         * is passed into the assertion method, and invoked when everything has been completed.
         *
         * @method async
         * @param testFn {Function}
         * @return {void}
         */
        async: function async(testFn) {

            var done = false;

            /**
             * @method isDone
             * @return {void}
             */
            var isDone = function isDone() {
                done = true;
            };

            /**
             * @method tryFlush
             * @param service {Object}
             * @return {void}
             */
            var tryFlush = function tryFlush(service) {

                try {
                    service.flush();
                }
                catch (exception) {}

            };

            inject(function inject($timeout, $interval, $httpBackend) {

                $window.runs(function runs() {

                    // Invokes the specified test method and flushes the necessary services.
                    testFn(isDone);

                    tryFlush($interval);
                    tryFlush($timeout);
                    tryFlush($httpBackend);

                });

                $window.waitsFor(function waitsFor() {

                    // We're all done, so the test can run its assertions!
                    return done;

                });

            });

        }

    };

})(window);