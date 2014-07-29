Kiwi.js
=======

![Travis](https://api.travis-ci.org/Wildhoney/Kiwi.js.png)
&nbsp;
![npm](https://badge.fury.io/js/kiwi-js.png)

* **npm:** `npm install kiwi-js`

Purpose
-------

Kiwi.js attempts to provide a DRY interface for your Jasmine/Karma unit tests &ndash; requiring less code to write your tests, and making them easier to read. It is a wrapper around the [Jasmine](http://jasmine.github.io/) test suite.

Dependencies
-------

 * [Jasmine](http://jasmine.github.io/) for the test suite and assertion library;
 * [Karma](http://karma-runner.github.io/0.12/index.html) for running the tests;
 * [Karma Preprocessor](https://github.com/karma-runner/karma-html2js-preprocessor) for adding fixture support;

First Look
-------

In order to demonstrate Kiwi.js, consider your basic controller test which requires injecting your `$rootScope`, instantiating a new `scope` and then instantiating your controller with the `scope` instance:

```javascript
inject(function($rootScope, controller) {

    var scope = $rootScope.$new();
    $controller('KiwiController', { scope: scope });

});
```

With Kiwi.js you can write the above code in one line and it is **much** more intuitive:

```javascript
var controller = kiwi.controller.create('KiwiController');
```

Fixtures
--------

Loading a fixture requires the [`karma-html2js-preprocessor`](https://github.com/karma-runner/karma-html2js-preprocessor) module &ndash; follow the instructions there for modifying your Karma configuration file.

By default the fixtures are configured to point to a specific location &ndash; likely you'll want to change that, and that can be done in the `beforeEach` hook:

```javascript
beforeEach(function() {

    kiwi.service.path('project/services/fixtures/{{name}}.json');
    kiwi.directive.path('project/directives/fixtures/{{name}}.html');
    kiwi.controller.path('project/controllers/fixtures/{{name}}.json');

});
```

Syntax-wise the `path` method accepts a string that is parsed using the [`$interpolate`](https://docs.angularjs.org/api/ng/service/$interpolate) service and therefore the `{{name}}` will become the property that is passed in when you're reading a fixture.

Once you've configured your Karma configuration and paths above, you can load a fixture for a controller, service, or directive with ease:

```javascript
var people = kiwi.controller.fixture('people');
```

Controllers
--------

For a controller you require a scope that is injected into the controller, and all of the methods and properties reside on the scope.

Therefore you can instantiate your controller and immediately begin adding your assertions.

```javascript
var controller = kiwi.controller.create('PeopleController');
expect(controller.data.length).toEqual(5);
```

Injecting dependencies can be achieved with the second argument of the `create` method &ndash; which accepts an `object` of dependencies:

```javascript
var controller = kiwi.controller.create('PeopleController', {
    PeopleService: function PeopleServiceMock() {}
});
```

Services
--------

Kiwi.js does not provide a way for services to be created since they exist as injectable entities. Instead Kiwi.js only provides a way to supply [fixtures](#fixtures) to services.

```javascript
it('Should be able to inject the service;', inject(function(PeopleService) {
    expect(PeopleService).toBeDefined();
});
```

Fixtures for services behave in the same way as they do for the controllers.

Directives
--------

Directives can be somewhat difficult in testing because they often have many scopes. Kiwi.js has the philosophy that if you can find the root scope of the directive, then finding child scopes are as simple as using the `find` method to traverse the DOM. Therefore Kiwi.js returns the root scope of the directive &ndash; whether it's an isolated scope directive or not.

```javascript
var directive = kiwi.directive.create('pets');
expect(directive.scope).toBeDefined();
expect(directive.html).toBeDefined();
expect(typeof directive.html.find).toEqual('function');
```

From there you can affect the behaviour of the directive and respond accordingly. For example, to initiate a `click` event we can use Angular's `triggerHandler` method:

```javascript
var directive = kiwi.directive.create('pets');
directive.html.triggerHandler('click');
```

In initiating the `pets` directive, the **pets.html** fixture will be read from the fixture path and then compiled with a directive.

Asynchronicity
--------

Kiwi.js can also handle asynchronous with aplomb using the `kiwi.async` method. Since Karma currently uses a slightly older Jasmine version, for anybody who has used Jasmine `>=2.0.0` the syntax for the async tests will be familiar.

Async tests are suitable for all `$http`, `$timeout`, and `$interval` functionality &ndash; and Kiwi.js will automatically `flush` all three for you.

```javascript
kiwi.async(function(done) {

    // getPeople method could be anything that returns a promise.
    controller.getPeople().then(function(collection) {
        expect(collection.length).toEqual(11);
    });

});
```

In testing `$timeout` and `$interval` functionality, the above will be perfectly fine. For `$http` functionality, however, there are additional steps to be taken &ndash; although the above will work once you've added those additional steps.

Just like in regular Angular tests, you need to define the expected AJAX requests:

```javascript
var fixture = kiwi.service.fixture('pets');
kiwi.http.when('GET', '/pets').respond(fixture);

// ...And then you can proceed as normal!
kiwi.async(function(done) {

    // getPeople method could be anything that returns a promise.
    controller.getPeople().then(function(collection) {
        expect(collection).toEqual(fixture);
    });

});
```

Kiwi.js also implements Angular's `expect` so you can assert that a particular AJAX request has been fired:

```javascript
kiwi.http.expect('GET', '/pets');
```