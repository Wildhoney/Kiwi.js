(function($angular) {

    $angular.module('kiwiApp').service('PetsService', function PetsService($http) {

        var service = {};
        
        service.pets = [];

        service.getPets = function getPets() {

            return $http.get('/pets').then(function withPets(collection) {
                service.pets = collection.data;
            });

        };

        return service;

    });

})(window.angular);