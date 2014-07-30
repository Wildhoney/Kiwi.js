describe('Kiwi Module', function() {

    beforeEach(module('kiwiApp'));

    beforeEach(function() {
        kiwi.service.path('project/services/fixtures/{{name}}.json');
        kiwi.directive.path('project/directives/fixtures/{{name}}.html');
        kiwi.controller.path('project/controllers/fixtures/{{name}}.json');
    });

    describe('Controllers', function() {

        it('Should be able to fetch all the people;', function() {

            var controller = kiwi.controller.create('PeopleController', {
                Data: kiwi.controller.fixture('people')
            });

            expect(controller.people.length).toEqual(0);
            controller.getPeople();

            kiwi.run(function() {

                expect(typeof controller.getPeople).toEqual('function');
                expect(controller.people.length).toEqual(2);
                expect(controller.people[0].name).toEqual('Adam');
                expect(controller.people[1].name).toEqual('Maria');

            });

        });

    });

    describe('Services', function() {

        it('Should be able to fetch all the pets;', inject(function(PetsService) {

            var fixture = kiwi.service.fixture('pets');
            kiwi.http.when('GET', '/pets').respond(fixture);

            expect(PetsService.pets.length).toEqual(0);
            expect(typeof PetsService.getPets).toEqual('function');

            PetsService.getPets();

            kiwi.run(function() {
                expect(PetsService.pets.length).toEqual(5);
            });

        }));

    });

    describe('Directives', function() {

        it('Should be able to switch city when clicked;', function() {

            var directive = kiwi.directive.create('city');
            expect(directive.scope.cityName).toEqual('London');
            directive.html.triggerHandler('click');
            expect(directive.scope.cityName).toEqual('Moscow');

        });

    });

});