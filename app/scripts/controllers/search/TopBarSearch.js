'use strict';
mdlDirectTvApp.controller('topBarSearchCtrl', ['analyticsService', 'railService', 'Sessions', '$scope', 'configuration', '$rootScope', '$routeParams', 'debounce', 'NewSearchDataService', '$timeout', '$filter', '$location', '$log',
    function(analyticsService, railService, Sessions, $scope, configuration, $rootScope, $routeParams, debounce, NewSearchDataService, $timeout, $filter, $location, $log) {
        //Set Search Term as null On Page load
        $scope.searchTerm = '';
        //placeholder for search placeholder
        $scope.searchPlaceholder = 'TXT_SEARCH_INITIAL_PLACEHOLDER';
        // jQuery('#searchDropdownScroll').bind('mousewheel DOMMouseScroll', function(e) {
        //     var scrollTo = null;
        //     if (e.type == 'mousewheel') {
        //         scrollTo = (e.originalEvent.wheelDelta * -1);
        //     }
        //     else if (e.type == 'DOMMouseScroll') {
        //         scrollTo = 40 * e.originalEvent.detail;
        //     }
        //     if (scrollTo) {
        //         e.preventDefault();
        //         $(this).scrollTop(scrollTo + $(this).scrollTop());
        //     }
        // });
        //get route params
        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.titleId = $rootScope.getParameterByName('titleId');
        });
        //On every 2 sec trigger VOD/people Apion
        var triggerSearchApiWithDelay = debounce(2000, function() {
            $rootScope.searchApiResult = {};
            var searchPageDetails = $rootScope.getPageDetails("search");
            if (!!searchPageDetails) {
                var searchOptions = searchPageDetails.search;
                var allVODSearchItems = $filter('filter')(searchOptions.search_tab, {
                    id: 'all'
                });
                //vod search result
                if (!!$scope.searchTerm && !!allVODSearchItems[0] && !!allVODSearchItems[0].query_option) {
                    var queryOptions = JSON.parse(allVODSearchItems[0].query_option);
                    queryOptions.query = $scope.searchTerm;
                    NewSearchDataService.getSearchResultByMiniCall(queryOptions, $scope.searchTerm).then(function(response) {
                        response = response.data;
                        if (!!response) {
                            $scope.loadingVODSpinner = false;
                            $rootScope.searchApiResult.searchTerm = $scope.searchTerm;
                            $rootScope.searchApiResult.all = response;
                            $rootScope.searchApiResult.all.title = allVODSearchItems[0].title;
                            NewSearchDataService.setSearchText($scope.searchTerm);
                        }
                    }, function(response) { // optional
                    });
                }
                //people search result
                if (!!$scope.searchTerm) {
                    NewSearchDataService.getSearchResultByTermAndType($scope.searchTerm, "people").then(function(response) {
                        response = response.data;
                        if (!!response) {
                            $rootScope.searchApiResult.people = response;
                            $scope.loadingPeopleSpinner = false;
                        }
                    }, function(response) { // optional
                    });
                }
                //Search Result Iteration
                $rootScope.$watch("searchApiResult", function(newValue, oldValue) {
                    if (typeof newValue.people == 'undefined' || typeof newValue.all == 'undefined') {
                        return true;
                    }
                    if (newValue.all.NumOfResults == 0 && newValue.people.NumOfResults == 0) {
                        $scope.showSearchResult = false;
                        $scope.showNoSearchResult = true;
                        return true;
                    }
                    $scope.showSearchResult = true;
                    var newVodLimitBasedOnPeopleSearchResult;
                    if (newValue.people.NumOfResults > searchOptions.dropdown_panel.people_max_limt) {
                        newValue.people.newlink = $rootScope.$eval("searchApiResult.people.link | limitTo:" + searchOptions.dropdown_panel.people_max_limt);
                        newVodLimitBasedOnPeopleSearchResult = searchOptions.dropdown_panel.vod_max_limit;
                    } else {
                        newValue.people.newlink = newValue.people.link;
                        newVodLimitBasedOnPeopleSearchResult = (newValue.people.NumOfResults == 1) ? (searchOptions.dropdown_panel.max_limit - 1) : searchOptions.dropdown_panel.max_limit;
                    }
                    if (!!newVodLimitBasedOnPeopleSearchResult && !!newValue.all) {
                        newValue.all.assets = $rootScope.$eval("searchApiResult.all.assets | limitTo:" + newVodLimitBasedOnPeopleSearchResult);
                    }
                }, true);
            }
        });
        $scope.navigateToCustomPage = function(source, id) {
            $scope.showSearchResult = $scope.showNoSearchResult = $scope.showSearchHint = false;
            $location.path('/' + source).search({
                titleId: id
            });
        };
        $scope.onChangeGetsearchResult = function() {
            $scope.loadingVODSpinner = $scope.loadingPeopleSpinner = false;
            $scope.showSearchResult = $scope.showNoSearchResult = $scope.showSearchHint = false;
            if (!!$scope.searchTerm.length && $scope.searchTerm.length > 2) {
                $scope.showCloseButtonOnInputField = true;
                $scope.showSearchHint = false;
                $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
                    if (newValue == 'undefined' || typeof newValue == 'undefined') {
                        return true;
                    }
                    $scope.loadingVODSpinner = $scope.loadingPeopleSpinner = true;
                    triggerSearchApiWithDelay();
                });
            } else {
                $scope.showSearchHint = false;
                $scope.showCloseButtonOnInputField = false;
                $scope.savedSearchTerms = NewSearchDataService.getLastTwoSearchTerms();
            }
        };
        $scope.closeSearchInput = function() {
            triggerSearchApiWithDelay.cancel();
            $scope.searchTerm = '';
            $scope.showSearchResult = $scope.showSearchHint = $scope.showCloseButtonOnInputField = $scope.loadingPeopleSpinner = $scope.loadingVODSpinner = false;
        };
        $scope.onFocus = function() {
            $scope.searchPlaceholder = 'TXT_SEARCH_PLACEHOLDER';
            $scope.focused = true;
            if (!!$scope.searchTerm.length && $scope.searchTerm.length > 1) {
                $scope.showSearchHint = false;
                if (!!$rootScope.searchApiResult) {
                    if ($rootScope.searchApiResult.all && ($rootScope.searchApiResult.all.NumOfResults > 0 || $rootScope.searchApiResult.people.NumOfResults > 0)) {
                        $scope.showSearchResult = true;
                        $scope.showNoSearchResult = false;
                    } else {
                        $scope.showSearchResult = false;
                        $scope.showNoSearchResult = true;
                    }
                } else {
                    if ($scope.searchTerm.length > 2) $scope.onChangeGetsearchResult();
                }
            } else {
                $scope.showSearchResult = $scope.showNoSearchResult = false;
                $scope.savedSearchTerms = NewSearchDataService.getLastTwoSearchTerms();
                if ($scope.savedSearchTerms.length > 0) {
                    $scope.showSearchHint = true;
                } else {
                    $scope.showSearchHint = false;
                }
            }
        };
        $scope.onRemoveHintValue = function(value) {
            NewSearchDataService.removeValueFromSavedSearchTerms($scope.savedSearchTerms, value);
        };
        $scope.setHintTextAsSearchTerm = function(value) {
            $scope.searchTerm = value;
            $timeout(function() {
                jQuery("#searchTerm").focus();
                $scope.onChangeGetsearchResult();
            }, 100);
        };
        $scope.goToSearchDetailPage = function(type, peopleName) {
            if ($scope.showNoSearchResult && !$scope.showSearchResult) {
                $location.path('/noSearchResult').search({
                    vod: $scope.searchTerm
                });
            } else if (!$scope.showNoSearchResult && $scope.showSearchResult) {
                if (type == "vod") {
                    $location.path('/search').search({
                        vod: $scope.searchTerm
                    });
                } else if (type == "people") {
                    $location.path('/search').search({
                        vod: $scope.searchTerm,
                        people: peopleName
                    });
                }
            }
            $scope.showSearchResult = $scope.showNoSearchResult = $scope.showSearchHint = false;
        };
    }
]);