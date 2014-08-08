(function($angular) {

    $angular.module('kiwiApp').directive('town', function PetsService() {

        return {

            restrict: 'E',
            scope: {},
            templateUrl: 'project/templates/town-template.html',

            link: function link(scope) {

                scope.name = 'Long Eaton';

            }

        };

    });

})(window.angular);