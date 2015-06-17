'use strict';
// Footer Controller
mdlDirectTvApp.controller('FooterCtrl', ['$scope', 'configuration',
    function FooterCtrl($scope, configuration) {
        $scope.buildNumber = configuration.app_build_number;
    }
]);