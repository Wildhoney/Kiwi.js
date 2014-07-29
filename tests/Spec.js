describe('Kiwi Module', function() {

    beforeEach(module('kiwiApp'));

    beforeEach(function() {
        kiwi.service.path('project/services/fixtures/{{name}}.json');
        kiwi.directive.path('project/directives/fixtures/{{name}}.html');
        kiwi.controller.path('project/controllers/fixtures/{{name}}.json');
    });

    describe('Controllers', function() {

        it('Should be able to change the name from "Adam" to "Maria";', function() {

            var controller = kiwi.controller.create('KiwiController', {
                Data: kiwi.controller.fixture('people')
            });

            expect(controller.people.length).toEqual(0);

            kiwi.async(function(done) {

                expect(typeof controller.getPeople).toEqual('function');

                controller.getPeople().then(function(collection) {

                    expect(collection.length).toEqual(2);

                    expect(collection[0].name).toEqual('Adam');
                    expect(collection[1].name).toEqual('Maria');

                    expect(controller.people[0].name).toEqual('Adam');
                    expect(controller.people[1].name).toEqual('Maria');

                    done();

                });

            });

        });

    });

});