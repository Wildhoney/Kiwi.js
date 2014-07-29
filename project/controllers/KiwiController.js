(function($angular) {

    $angular.module('kiwiApp').controller('KiwiController', function KiwiController($scope, $q, $timeout) {

        $scope.name = 'Adam';

        $scope.getPerson = function getPerson() {

            var defer = $q.defer();

            $timeout(function timeout() {

                // Resolve the promise to "Maria" after 10,000 milliseconds.
                defer.resolve({ name: 'Maria' });

            }, 10000);

            defer.promise.then(function then(model) {

                // Once the promise has been resolved we'll change the name.
                $scope.name = model.name;

            });

            return defer.promise;

        };

    });

})(window.angular);