describe('Kiwi Module', function() {

    beforeEach(module('kiwiApp'));

    beforeEach(function() {
        kiwi.service.path('example/services/{{name}}.json');
        kiwi.directive.path('example/directives/{{name}}.html');
        kiwi.controller.path('example/controllers/{{name}}.json');
    });

    describe('Controllers', function() {

        it('Should be able to change the name from "Adam" to "Maria";', function() {

            var controller = kiwi.controller.create('KiwiController');
            expect(controller.name).toEqual('Adam');

            kiwi.async(function(done) {

                expect(typeof controller.getPerson).toEqual('function');

                controller.getPerson().then(function(model) {

                    expect(model.name).toEqual('Maria');
                    expect(controller.name).toEqual('Maria');
                    done();

                });

            });

        });

    });

});