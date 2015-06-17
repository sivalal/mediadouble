'use strict';
/* NetworkList Controllers */
mdlDirectTvApp.controller('GenreCtrl', ['$scope', '$http', 'configuration', '$rootScope', '$routeParams', function($scope, $http, configuration, $rootScope, $routeParams) {
    $scope.GenreType = $scope.GroupType = $routeParams.grouptype;
    $scope.Source = $routeParams.source;
    $scope.PageType = $routeParams.pagetype;
    $scope.pagename = $routeParams.pageid;
    switch ($scope.Source) {
        case "movie":
            $scope.SP_Category = "movie";
            break;
        case "TV":
            $scope.SP_Category = "tvShow";
            break;
        default:
            $scope.SP_Category = "movie";
            break;
    }
    $scope.myInterval = 5000;
    // set interval in sec
    $scope.slides = [];
    //set slides array
    if (!$rootScope.genre) {
        //        $http({
        //            method: 'Get',
        //            url: configuration.server_url + '/search/getGenreList'
        //        }).success(function(data, status, headers, config) {
        //            $rootScope.genre = data;
        //            $scope.selectedGenre = "GENRE";
        //            $scope.selectedGenreCollectionName = null;
        //        }).error(function(data, status, headers, config) {
        //            $scope.message = 'Unexpected Error';
        //        });
    }
    // $http({
    //    method: 'Get',
    //    url: configuration.server_url + '/appgrid/getPageDetails?page=genre'
    // }).success(function (data, status, headers, config) {
    //    $scope.pageData = data;
    //    if (data && data.showcase) {
    //       var ID_List = data.showcase.ID_List.toString();
    //    }
    //    //poster call    
    //    $http({
    //       method: 'Get',
    //       url: configuration.server_url + '/genre/GenrePosterList'
    //    }).success(function (data, status, headers, config) {
    //       $scope.slides = data;
    //       // thumbslides=data.thumblistCarouselOneArr;
    //       // $scope.ajaxHomeSpinner = false;
    //    }).error(function (data, status, headers, config) {
    //       $scope.message = 'Unexpected Error';
    //    });
    //    //poster call    
    // }).error(function (data, status, headers, config) {
    //    $scope.message = 'Unexpected Error';
    // });
    //poster call    
    $http({
        method: 'Get',
        //  url: configuration.server_url + '/genre/GenrePosterList'
        url: configuration.server_url + '/home'
    }).success(function(data, status, headers, config) {
        $scope.slides = data.mainCarouselArr;
    }).error(function(data, status, headers, config) {
        $scope.message = 'Unexpected Error';
    });
    var thumbslides;
    $scope.GetTileList = function() {
        var call_url;
        if ($scope.PageType == "genre") {
            call_url = configuration.server_url + '/genre/GenreList?genre=' + $scope.GroupType;
        } else {
            $scope.GenreType = "All";
            var group = $scope.GroupType.replace(" ", "_");
            if ($scope.GroupType == "recently added") {
                call_url = configuration.server_url + '/searchApi/getRecentlyAdded';
            } else {
                call_url = configuration.server_url + '/group/GetGroupResult?group_type=' + group;
            }
        }
        $http({
            method: 'Get',
            url: call_url
        }).success(function(data, status, headers, config) {
            $scope.ContentList = data;
        }).error(function(data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    }
    $scope.GetTileList();
    $scope.Sort_drop_down = [{
        key: '0',
        val: 'recently added',
        label: "Recently Added"
    }, {
        key: '1',
        val: 'most popular',
        label: "Most Popular"
    }, {
        key: '2',
        val: 'recommended',
        label: "Recommended"
    }];
    $scope.dropdownLabel = $scope.Sort_drop_down[0].label;
    $scope.changeSortOrder = function(index) {
        $scope.dropdownLabel = $scope.Sort_drop_down[index].label;
        $scope.GetTileList();
    }
    $scope.filters = [
        [{
            key: '0',
            val: 'All',
            isFilterSelected: false
        }, {
            key: '1',
            val: 'Region 01',
            isFilterSelected: false
        }, {
            key: '2',
            val: 'Region 02',
            isFilterSelected: false
        }, {
            key: '3',
            val: 'Region 03',
            isFilterSelected: false
        }, {
            key: '4',
            val: 'Region 04',
            isFilterSelected: false
        }, {
            key: '5',
            val: 'Region 05',
            isFilterSelected: false
        }],
        [{
            key: '6',
            val: 'Region 06',
            isFilterSelected: false
        }, {
            key: '7',
            val: 'Region 07',
            isFilterSelected: false
        }, {
            key: '8',
            val: 'Region 08',
            isFilterSelected: false
        }, {
            key: '9',
            val: 'Region 09',
            isFilterSelected: false
        }, {
            key: '10',
            val: 'Region 10',
            isFilterSelected: false
        }, {
            key: '11',
            val: 'Region 11',
            isFilterSelected: false
        }],
        [{
            key: '12',
            val: 'Region 12',
            isFilterSelected: false
        }, {
            key: '13',
            val: 'Region 13',
            isFilterSelected: false
        }, {
            key: '14',
            val: 'Region 14',
            isFilterSelected: false
        }, {
            key: '15',
            val: 'Region 15',
            isFilterSelected: false
        }, {
            key: '16',
            val: 'Region 16',
            isFilterSelected: false
        }, {
            key: '17',
            val: 'Region 17',
            isFilterSelected: false
        }]
    ];
}]);