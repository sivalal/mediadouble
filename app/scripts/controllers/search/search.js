'use strict';
mdlDirectTvApp.controller('NewSearchCtrl', ['analyticsService', '$sce', '$scope', '$filter', 'NewSearchDataService', 'configuration', '$rootScope', '$routeParams', '$location',
    function(analyticsService, $sce, $scope, $filter, NewSearchDataService, configuration, $rootScope, $routeParams, $location) {
        console.log("New search controll..");
        $scope.searchAssets = {};
        $scope.selected = 0;
        $scope.type = "all";
        $scope.disablePeopleScroll = true;
        //Test search text
        $scope.setSearchTypeBasedOnRouteParams = function() {
            if (!!$routeParams.vod && (typeof $routeParams.people == 'undefined')) {
                $scope.searchTerm = $scope.vodSearchTerm = $routeParams.vod;
                $scope.searchType = "vod";
                $scope.filterSearchTab = $scope.searchPageDetails.search.search_tab;
                $scope.showMainSearchList = false;
            } else if (!!$routeParams.vod && !!$routeParams.people) {
                $scope.instantPeopleText = $routeParams.vod;
                $scope.searchTerm = $routeParams.people;
                $scope.vodSearchTerm = $routeParams.vod;
                $scope.searchType = "people";
                $scope.filterSearchTab = $scope.searchPageDetails.search.people_search_tabs;
                $scope.showMainSearchList = true;
            } else if ((typeof $routeParams.vod == 'undefined') && (typeof $routeParams.people == 'undefined')) {
                $location.path('/');
            }
        };
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if (newValue == '' || typeof newValue == 'undefined') {
                return true;
            }
            $scope.searchPageDetails = $rootScope.getPageDetails("search");
            //get the mini api call to display search result
            $scope.populateSearchResultBasedOnQueryOption();
            console.log("$rootScope.searchApiResult-------");
            console.log($rootScope.searchApiResult);
            //populate people result based on instant api
            if ($rootScope.empty($rootScope.searchApiResult)) {
                $scope.ajaxSearchSpinner_People = true;
                $scope.populatePeopleSearchDataByInstantApiCall();
            }
            // $rootScope.doInstantCall = true;
            $scope.disablePeopleScroll = false;
        });
        $rootScope.$watch('appgridAssets', function(newValue, oldValue) {
            if (newValue != '') {
                $rootScope.$watch('appGridMetadata', function(newAppgridValue, oldAppgridValue) {
                    if (newAppgridValue !== '') {
                        $scope.searchObj = $rootScope.getPageDetails("search");
                        $scope.promotion = $scope.searchObj.search.promo_banner.promo_images;
                        $scope.links = $scope.searchObj.search.promo_banner.links;
                        $scope.promotion.en_US = $rootScope.updateimagePath($rootScope.appgridAssets[$scope.promotion['en_US']]);
                        $scope.promotion.es_ES = $rootScope.updateimagePath($rootScope.appgridAssets[$scope.promotion['es_ES']]);
                    }
                });
            }
        }, true);
        $scope.trustUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };
        $scope.populateSearchResultBasedOnQueryOption = function(isScroll) {
            $scope.ajaxSearchSpinner_FullPeople = true;
            $scope.setSearchTypeBasedOnRouteParams();
            if (!isScroll) {
                for (var tab in $scope.filterSearchTab) {
                    $scope.searchAssets[$scope.filterSearchTab[tab].id] = {};
                    if (!!$scope.filterSearchTab[tab].query_option) {
                        $scope.searchAssets[$scope.filterSearchTab[tab].id].showmore = 'yes';
                    }
                }
            }
            if (!!$scope.filterSearchTab) {
                var allSearchItems = $filter('filter')($scope.filterSearchTab, {
                    id: $scope.type
                });
            }
            if (!!allSearchItems[0].query_option) {
                $scope.showNoResult = false;
                var queryOption = JSON.parse(allSearchItems[0].query_option);
                if ($scope.searchType == "vod" && !!queryOption.query) {
                    queryOption.query = $scope.searchTerm;
                } else if ($scope.searchType == "people" && !!queryOption.people.name) {
                    queryOption.people.name = $scope.searchTerm;
                }
                if ($scope.searchAssets[$scope.type] && $scope.searchAssets[$scope.type].pageCount) {
                    $scope.pageCount = $scope.searchAssets[$scope.type].pageCount;
                } else {
                    $scope.pageCount = queryOption.page_number;
                }
                queryOption.page_number = ($scope.pageCount) ? $scope.pageCount : queryOption.page_number;
                $scope.disablePeopleScroll = true;
                NewSearchDataService.getSearchResultByMiniCall(queryOption, $scope.searchTerm).then(function(response) {
                    var miniSearchData = response.data;
                    //Add assets to array
                    $scope.addAssetsToArray(miniSearchData);
                    $scope.ajaxSearchSpinner_FullPeople = false;
                }, function(response) { // optional
                    $scope.ajaxSearchSpinner_FullPeople = false;
                    console.log("sorry.Try again");
                });
            }
        };
        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) == path) {
                return "active"
            } else {
                return ""
            }
        };
        $scope.populateSearchDataByInstantApiCall = function() {
            NewSearchDataService.getSearchResultByTermAndType($scope.searchTerm, 'vod').then(function(response) {
                response = response.data;
                $scope.ajaxSearchSpinner_Movie = false;
                console.log("Search data");
                console.log(response);
                NewSearchDataService.setLastVideoSearchResult(response.vod, false);
                var titleIdsAndPositions = NewSearchDataService.getAllTitleIdsAndPositionsFromInstantCall(response);
                $scope.allTitleIds = titleIdsAndPositions.titleIds;
                $scope.assetPositions = titleIdsAndPositions.positions;
                console.log("All title id");
                console.log($scope.allTitleIds);
                console.log(JSON.stringify($scope.allTitleIds));
                console.log("All title positions");
                console.log($scope.assetPositions);
                $scope.populateSearchDataByMiniApiCall();
            }, function(response) { // optional
                $scope.vodNoContent = true;
                $scope.ajaxSearchSpinner_Movie = false;
            });
        };
        $scope.populateSearchDataByMiniApiCall = function() {
            NewSearchDataService.getSearchResultByMiniCall($scope.searchTerm, $scope.allTitleIds, $scope.assetPositions).then(function(res) {
                console.log("All mins");
                console.log(res.data);
                var miniSearchData = res.data;
                NewSearchDataService.setLastVideoSearchResult(miniSearchData.assets, true);
                console.log("set data");
                console.log(NewSearchDataService.getLastVideoSearchResult());
            });
        };
        //get result for people instant search
        $scope.populatePeopleSearchDataByInstantApiCall = function() {
            $rootScope.searchApiResult = {};
            if ($scope.instantPeopleText) {
                var peopleName = $scope.instantPeopleText;
                $scope.instantPeopleText = undefined;
            } else {
                var peopleName = $scope.searchTerm;
            }
            NewSearchDataService.getSearchResultByTermAndType(peopleName, 'people').then(function(response) {
                response = response.data;
                $rootScope.searchApiResult.people = response;
                $rootScope.allPeopleList = $scope.peopleList;
                $scope.ajaxSearchSpinner_People = false;
            }, function(response) { // optional
                $scope.ajaxSearchSpinner_People = false;
                console.log("people list not available right now.");
            });
        };
        //Add assets to the corresponding fields types in array.
        $scope.addAssetsToArray = function(miniSearchData) {
            if (miniSearchData.NumOfResults > 0) {
                var totalItems = miniSearchData.paginationDetails.NumOfResults;
                $scope.allItemsCount = '(' + totalItems + ')';
                console.log("SEARCH ASSETS-------------------");
                console.log($scope.searchAssets);
                console.log($scope.type);
                $scope.searchAssets[$scope.type].totalCount = totalItems;
                var showMore = miniSearchData.paginationDetails.showmore;
                if (showMore == "no") {
                    $scope.disablePeopleScroll = true;
                    $scope.searchAssets[$scope.type].showmore = 'no';
                } else {
                    $scope.pageCount = miniSearchData.paginationDetails.new_page_number;
                    console.log("searchAssets");
                    console.log($scope.searchAssets);
                    $scope.searchAssets[$scope.type].pageCount = $scope.pageCount;
                    $scope.searchAssets[$scope.type].showmore = 'yes';
                    $scope.disablePeopleScroll = false;
                }
                if ($scope.searchAssets[$scope.type].results) {
                    console.log("Adding more people....");
                    for (var i in miniSearchData.assets) {
                        $scope.searchAssets[$scope.type].results.push(miniSearchData.assets[i]);
                    }
                } else {
                    $scope.searchAssets[$scope.type].results = miniSearchData.assets;
                }
                console.log("searchAssets");
                console.log($scope.searchAssets);
            } else {
                console.log("no search results");
                $scope.showNoResult = true;
                $scope.searchAssets[$scope.type].totalCount = 0;
                $scope.allItemsCount = '(0)';
                $scope.searchAssets[$scope.type].results = [];
                $scope.searchAssets[$scope.type].showmore = 'no';
                $scope.searchAssets[$scope.type].pageCount = 1;
            }
        };
        //Shows the people assets in current video type.
        $scope.goToFullPage = function(type, searchText, index) {
            var callMiniApi = false;
            if (typeof index == "number") {
                $scope.selected = index;
            }
            if (type && type != '' && (type != $scope.type)) {
                var isTabClick = true;
                $scope.type = type;
                var totalCount = $scope.searchAssets[$scope.type].totalCount;
                $scope.allItemsCount = (typeof totalCount == "number") ? '(' + totalCount + ')' : '';
                if (totalCount == 0) {
                    $scope.showNoResult = true;
                } else {
                    $scope.showNoResult = false;
                }
                if ($scope.searchAssets[$scope.type] && $scope.searchAssets[$scope.type].pageCount) {
                    callMiniApi = false;
                } else {
                    callMiniApi = true;
                }
                if ($scope.searchAssets[$scope.type].showmore == 'yes') {
                    $scope.disablePeopleScroll = false;
                } else {
                    $scope.disablePeopleScroll = true;
                }
            }
            if (searchText && searchText != '' && (searchText != $scope.searchTerm)) {
                $scope.showMainSearchList = true;
                $scope.searchTerm = searchText;
                // $rootScope.doInstantCall = false;
                $location.search({
                    vod: $scope.vodSearchTerm,
                    people: $scope.searchTerm
                });
                for (var tab in $scope.filterSearchTab) {
                    $scope.searchAssets[$scope.filterSearchTab[tab].id] = {};
                    $scope.searchAssets[$scope.filterSearchTab[tab].id].showmore = 'yes';
                }
                $scope.pageCount = 1;
                callMiniApi = true;
            } else if (searchText && searchText != '') {
                $scope.showMainSearchList = true;
            }
            if (callMiniApi == true) {
                callMiniApi == false;
                if ($scope.searchAssets[$scope.type].showmore == 'yes') {
                    $scope.ajaxSearchSpinner_FullPeople = true;
                    $scope.populateSearchResultBasedOnQueryOption(isTabClick);
                } else {
                    console.log("end of the search list");
                }
            }
        };
        //For displaying the new assets as lazy loading.
        $scope.getMoreResults = function() {
            if ($scope.searchAssets[$scope.type].showmore == 'yes') {
                $scope.ajaxSearchSpinner_FullPeople = true;
                $scope.populateSearchResultBasedOnQueryOption('scroll');
            } else {
                console.log("end of the search list");
            }
        };
        //For going back to the VOD full search page.
        $scope.goToBackPage = function() {
            $scope.searchTerm = $scope.vodSearchTerm;
            // $rootScope.doInstantCall = false;
            $scope.showMainSearchList = false;
            $location.search({
                vod: $scope.vodSearchTerm
            });
        };
    }
]);