'use strict';
mdlDirectTvApp.controller('NoSearchResultCtrl', ['analyticsService', 'railService', 'Sessions', '$scope', 'configuration', '$rootScope', '$routeParams',
    function(analyticsService, railService, Sessions, $scope, configuration, $rootScope, $routeParams) {
        if (!!$routeParams.vod) {
            $scope.serchTerm = $routeParams.vod;
        } else {
            $location.path('/').search('');
        }
        $scope.pagename = 'noresultpage';
        /*Appgid Asset Watch*/
        $rootScope.$watch('[appGridMetadata,appgridAssets]', function(newValue, oldValue) {
            if (newValue[0] != '') {
                $scope.railList = [];
                $scope.pageDetails = $rootScope.getPageDetails($scope.pagename);
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    $scope.htmlTemplate = $scope.pageDetails.search.no_result.html_template;
                    console.log($scope.htmlTemplate);
                    if (typeof $scope.pageDetails['items'] !== 'undefined') $scope.railList = $scope.pageDetails['items'];
                    console.log('Complete items obj');
                    console.log($scope.railList);
                    $scope.VisiblerailList = [];
                    $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
                    //analytics
                    analyticsService.TrackCustomPageLoad($scope.pagename);
                }
            }
            if (newValue[1] != '') {}
        }, true);
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            updateRails();
        });

        function updateRails() {
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '/movie';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, $scope.type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, $scope.type);
            }
        }
        $scope.loadMore = function() {
            if (typeof $scope.VisiblerailList != 'undefined' && $scope.disableInfiniteScroll == false) {
                $scope.LoadMoreRailItem($scope.VisiblerailList.length, $rootScope.RailOnScrollItemCount);
                console.log("LoadMoreEvent fired");
                console.log($scope.VisiblerailList);
            }
        };
        $scope.disableInfiniteScroll = false;
        $scope.LoadMoreRailItem = function(curLength, noofnewAssets) {
            var TotalRailItems = $scope.railList.length;
            if ((curLength + noofnewAssets) >= TotalRailItems) {
                noofnewAssets = TotalRailItems - curLength;
                $scope.disableInfiniteScroll = true;
                console.log("disable ngscroll event true");
            }
            for (var j = (curLength != 0) ? (curLength - 1) : 0; j < (curLength + noofnewAssets); j++) {
                if (typeof $scope.railList[j] != 'undefined' && typeof $scope.VisiblerailList[j] == 'undefined') {
                    $scope.VisiblerailList.push($scope.railList[j]);
                }
            }
            console.log("Updated VisiblerailList");
            console.log($scope.VisiblerailList);
        };
    }
]);