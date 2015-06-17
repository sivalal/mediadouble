//controller for the content inside model template
mdlDirectTvApp.controller('PromotionsCtrl', ['$scope', 'Sessions', 'railService', '$rootScope', '$http', 'configuration',
    function($scope, Sessions, railService, $rootScope, $http, configuration) {
        $scope.pagename = 'promotions';
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                $scope.railList = [];
                $scope.pageDetails = $rootScope.getPageDetails('promotions');
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (typeof $scope.pageDetails['items'] !== 'undefined') $scope.railList = $scope.pageDetails['items'];
                }
            }
        });
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //-----------rails common code--------------------
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var tokenFlag = Sessions.getCookie('tokenFlag');
            var singleAssetBaseUrl = '/movie';
            if ($rootScope.isLoggedIn) {
                $rootScope.$watch("accessToken", function(newValue, oldValue) {
                    if (((typeof newValue != 'undefined') && (typeof oldValue == 'undefined')) || ((typeof newValue != 'undefined') && (typeof oldValue != 'undefined'))) {
                        railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.railList, newValue);
                    }
                });
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.railList, null);
            }
        }); //end of $scope.$on('ngRepeatFinished'  
        //end of rail related code    
    }
]);