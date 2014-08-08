(function($angular) {

    $angular.module('kiwiApp').directive('city', function PetsService() {

        return {

            restrict: 'A',
            scope: {},

            link: function link(scope, element) {

                scope.cityName = 'London';

                element.bind('click', function click() {

                    scope.cityName = 'Moscow';
                    scope.$apply();

                });

            }

        };

    });

})(window.angular);