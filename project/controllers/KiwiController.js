(function($angular) {

    $angular.module('kiwiApp').controller('KiwiController', function KiwiController($scope, $q, $timeout, Data) {

        $scope.people = [];

        $scope.getPeople = function getPeople() {

            var defer = $q.defer();

            $timeout(function timeout() {

                // Resolve the promise to "Maria" after 10,000 milliseconds.
                defer.resolve(Data);

            }, 10000);

            defer.promise.then(function then(collection) {

                // Once the promise has been resolved we'll change the name.
                $scope.people = collection;

            });

            return defer.promise;

        };

    });

})(window.angular);