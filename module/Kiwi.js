/**
 * @module Kiwi
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Kiwi.js
 */
(function Kiwi($window, $angular) {

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

                var path = '', pathTemplate  = this.pathTemplate;

                inject(function inject($interpolate) {
                    path = $interpolate(pathTemplate)({ name: name });
                });

                var directive = '',
                    html      = $window.__html__[path],
                    scopes    = [];

                inject(function inject($rootScope, $compile) {

                    var scope = $rootScope.$new();
                    directive = $compile(html)(scope);
                    scope.$digest();

                    $angular.forEach(directive, function(directive) {

                        if (!directive || directive.length) {
                            return;
                        }

                        // Determine if the directive is an isolated scope as defined by {}.
                        var element    = $angular.element(directive),
                            isIsolated = !!(element.hasClass('ng-isolate-scope')),
                            scope      = element.scope();

                        // Push the scope into the array, detecting first whether it's an isolated scope.
                        scopes.push(!isIsolated ? scope : scope.$$childHead);

                    });

                });

                return {

                    /**
                     * @property scope
                     * @type {Object}
                     */
                    scope: scopes.length === 1 ? scopes[0] : scopes,

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
         * @property flush
         * @type {Object}
         */
        flush: function flush() {

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

                tryFlush($interval);
                tryFlush($timeout);
                tryFlush($httpBackend);

            });

        },

        /**
         * Responsible for invoking a method callback and automatically flushing all async servicse.
         *
         * @method run
         * @param testFn {Function}
         * @return {void}
         */
        run: function run(testFn) {

            kiwi.flush();
            testFn();
            kiwi.flush();

        },

        test: {}

    };

})(window, window.angular);