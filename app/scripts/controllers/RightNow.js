mdlDirectTvApp.controller('RightNowCtrl', ['$scope', '$http',
    function RightNowCtrl($scope, $rootScope) {
        $scope.getParameterByName = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        var action = $scope.getParameterByName('action');
        switch (action) {
            case "login":
                $rootScope.loginModal(1);
                break;
            case "signup":
                $rootScope.signupModal(1);
                break;
            case "logout":
                $rootScope.logOut();
                break;
        }
    }
]);