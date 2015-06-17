'use strict';
//controller for the content inside search modal template
mdlDirectTvApp.controller('SearchCtrl', ['analyticsService', '$scope', '$http', 'SearchService', 'configuration', '$rootScope',
    function(analyticsService, $scope, $http, SearchService, configuration, $rootScope) {
        $scope.searchReady = false; //this variable defines whether search text is ready or not (lenght>=3)
        $scope.SrchDetailHead = "MOVIES & TV SHOWS";
        $scope.isfilterArea = true;
        $scope.TVSearchInProgress = $scope.LiveSearchInProgress = $scope.PeopleSearchInProgress = false;
        var DETAILS_CATEGORY_MOVIE_TV = "movies";
        var DETAILS_CATEGORY_LIVE = "live";
        var DETAILS_CATEGORY_PEOPLE = "people";
        $scope.data = Object();
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if (newValue != '') {
                var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                var dimension_large = device['webDesktop']['rail.standard'];
                $scope.newbase_large = imgbase + '/' + dimension_large + '/';
                var dimension = device['webDesktop']['search'];
                $scope.newbase = imgbase + '/' + dimension + '/';
            }
        });
        //function will be fired with every key stroke of searcht text
        $scope.SearchTextUpdated = function(searchTxt) {
            $scope.liveNoContent = $scope.peopleNoContent = $scope.vodNoContent = false;
            //checks if search is ready
            $scope.SearchText = searchTxt;
            if (searchTxt.length > 2) {
                keyDown();
                $scope.isTxtLengthQualify = true;
            } else {
                $scope.clearData();
            }
        };
        //invoked when the see all button is pressed
        //fills out the details for search details page
        $scope.ClickSeeAll = function(source) {
            //analytics
            analyticsService.TrackCustomPageLoad('search:all results');
            $scope.peopleContent = false;
            $scope.isfilterArea = false;
            $scope.SrchDetailHead = source;
            $scope.detailList = null;
            switch (source) {
                // case "LIVE":
                //     $scope.Detailcategory = DETAILS_CATEGORY_LIVE;
                //     $scope.detailList = $scope.data[DETAILS_CATEGORY_LIVE];
                //     break;
                // case "PEOPLE":
                //     $scope.Detailcategory = DETAILS_CATEGORY_PEOPLE;
                //     $scope.detailList = $scope.data[DETAILS_CATEGORY_MOVIE_TV];
                //     break;
                case "MOVIES & TV SHOWS":
                    $scope.Detailcategory = DETAILS_CATEGORY_MOVIE_TV;
                    $scope.detailList = $scope.data[DETAILS_CATEGORY_MOVIE_TV];
                    break;
            }
            if ($scope.detailList != null) {
                $scope.GetDescription();
            }
        };
        $scope.singlePeopleSearch = function(name) {
            $scope.isfilterArea = false;
            $scope.detailList = null;
            $scope.detailPeopleList = null;
            $scope.SrchDetailHead = 'PEOPLE';
            $scope.ajaxPeopleDetailsSpinner = true;
            $scope.clickedPeopleName = name;
            $http.get(configuration.server_url + '/searchApi/PeopleSearchDetail?name=' + name).then(function(response, headers) {
                $scope.peopleContent = true;
                $scope.ajaxPeopleDetailsSpinner = false;
                response = response.data;
                if ((typeof response != 'undefined') && (response != null)) {
                    $scope.detailPeopleList = response;
                }
            });
        };
        //gets the content description required from see all page
        $scope.GetDescription = function() {
            for (var i = 0; i < $scope.detailList.length; i++) {
                var position = i;
                $http.get(configuration.server_url + '/searchApi/GetSummary?contentId=' + $scope.detailList[i].id + '&position=' + i).
                success(function(data, status, headers, config) {
                    if (data.position) {
                        $scope.detailList[data.position].title = (data.title_medium) ? data.title_medium[$rootScope.CurrentLang] : '';
                        $scope.detailList[data.position].desc = (data.summary_short) ? data.summary_short[$rootScope.CurrentLang] : '';
                    }
                });
            }
        }

        function listOfTitleIds(obj) {
                var titleIds = [],
                    rows = 0;
                if (obj) {
                    rows = obj.length;
                    for (var i = 0; i < obj.length; ++i) {
                        for (var ind in obj[i]) {
                            if (ind === 'id') {
                                titleIds.push(obj[i][ind]);
                            }
                        }
                    }
                }
                return titleIds;
            }
            //populates the data for individual sections eg : tv&movie , peopl, live
        $scope.populate_IndividulaSection = function(SECTION, response, type) {
            console.log('search result');
            console.log(response);
            //checks if response from server is valid
            if (response == null || !response[type] || response.length == 0) {
                $scope.data[SECTION] = null;
                if ($scope.Detailcategory == SECTION && !$scope.isfilterArea) {
                    $scope.detailList = null;
                }
            } else if ($scope.isTxtLengthQualify) {
                $scope.searchReady = true;
                //checks if the search text matched wth value currently diplayed in screen
                if ($scope.SearchText == response.SearchText) {
                    $scope.data[SECTION] = response[type];
                    if (!$scope.isfilterArea && $scope.Detailcategory == SECTION) {
                        $scope.detailList = $scope.data[SECTION];
                    }
                    var idArray = [],
                        idArrayIndices = [];
                    for (var i = 0; i < $scope.data[SECTION].length; i++) {
                        idArray.push('"' + $scope.data[SECTION][i].id + '"');
                        idArrayIndices.push(i);
                        // $http.get(configuration.server_url + '/searchApi/GetSearchMiniContent?contentId=' + $scope.data[SECTION][i].id + '&position=' + i).
                        // success(function (data, status, headers, config) {
                        //     if(data.length != 'undefined') {
                        //         if(typeof data.warning!='undefined'){
                        //             $scope.data[SECTION][data.position].hide=true;
                        //         }
                        //         if (typeof data.imagePath!='undefined' && data.position != 'undefined' && $scope.isTxtLengthQualify) {
                        //             $scope.data[SECTION][data.position].imagePath    = data.imagePath;
                        //             $scope.data[SECTION][data.position].source       = data.source;
                        //             $scope.data[SECTION][data.position].titleType    = data.TitleTypeId;
                        //             $scope.data[SECTION][data.position].content_type = data.content_type;
                        //             $scope.data[SECTION][data.position].source_path  = data.source+"?titleId="+data.id;
                        //         } else {
                        //             $scope.liveNoContent = $scope.peopleNoContent = $scope.vodNoContent = false;
                        //         }
                        //     }
                        // }).error(function (data, status, headers, config) {
                        //     $scope.message = 'Unexpected Error';
                        // });
                    }
                    var positionArray = JSON.stringify(idArrayIndices);
                    $scope.dataArr = [], $scope.posArray = [];
                    $http.get(configuration.server_url + '/searchApi/GetSearchTotalMiniContent?contentId=[' + idArray + ']&position=' + positionArray).
                    success(function(data, status, headers, config) {
                        if (data.length != 'undefined') {
                            for (var objCount = 0; objCount < data.length - 1; objCount++) {
                                if (typeof data[objCount].warning != 'undefined') {
                                    $scope.data[SECTION][data[objCount].position].hide = true;
                                }
                                if (typeof data[objCount].imagePath != 'undefined' && data[objCount].position != 'undefined' && $scope.isTxtLengthQualify) {
                                    $scope.data[SECTION][data[objCount].position].imagePath = data[objCount].imagePath;
                                    $scope.data[SECTION][data[objCount].position].source = data[objCount].source;
                                    $scope.data[SECTION][data[objCount].position].titleType = data[objCount].TitleTypeId;
                                    $scope.data[SECTION][data[objCount].position].content_type = data[objCount].content_type;
                                    $scope.data[SECTION][data[objCount].position].source_path = data[objCount].source + "?titleId=" + data[objCount].id;
                                    $scope.dataArr.push(data[objCount].id);
                                    $scope.posArray.push(data[objCount].position);
                                } else {
                                    $scope.liveNoContent = $scope.peopleNoContent = $scope.vodNoContent = false;
                                }
                            }
                            if ((data.length - 1) < $scope.data[SECTION].length) {
                                for (var position in data[data.length - 1]) {
                                    $scope.data[SECTION].splice(position, 1);
                                }
                            }
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
            }
        }

        function populateSearchResult() {
                if ($scope.SearchText.length > 2) {
                    var searchTxt = $scope.SearchText;
                    //start all spinners
                    $scope.ajaxSearchSpinner_Movie = $scope.ajaxSearchSpinner_Live = $scope.ajaxSearchSpinner_People = true;
                    $scope.vodNoContent = $scope.liveNoContent = $scope.peopleNoContent = false;
                    $scope.peopleHeading = $scope.liveHeading = $scope.vodHeading = true;
                    // Call the async method and then do stuff with what is returned inside our own then function
                    // SearchService.GetSearchResultByTermAndType(searchTxt, 'live').then(function (response) {
                    //     response = response.data;
                    //     $scope.ajaxSearchSpinner_Live = false;
                    //     if(typeof response != "string") {
                    //         $scope.liveNoContent  = false;
                    //         $scope.populate_IndividulaSection(DETAILS_CATEGORY_LIVE, response, 'live');
                    //         //analytics
                    //         analyticsService.TrackSearch('Live_Search',
                    //                           "search: "+response.SearchText,
                    //          (typeof response!='undefined'? response.length : 0)
                    //         );
                    //     } else {
                    //         $scope.liveNoContent = true;
                    //     }
                    // }, function(response) { // optional
                    //     $scope.liveNoContent          = true;
                    //     $scope.ajaxSearchSpinner_Live = false;
                    // });
                    //server call for tv/movie search
                    SearchService.GetSearchResultByTermAndType(searchTxt, 'vod').then(function(response) {
                        response = response.data;
                        $scope.ajaxSearchSpinner_Movie = false;
                        if (typeof response != "string") {
                            $scope.vodNoContent = false;
                            $scope.populate_IndividulaSection(DETAILS_CATEGORY_MOVIE_TV, response, 'vod');
                            //analytics
                            analyticsService.TrackSearch('TV_Movie_Search', "search: " + response.SearchText, (typeof response != 'undefined' ? response.length : 0));
                        } else {
                            $scope.vodNoContent = true;
                        }
                    }, function(response) { // optional
                        $scope.vodNoContent = true;
                        $scope.ajaxSearchSpinner_Movie = false;
                    });
                    //get result for people search
                    SearchService.GetSearchResultByTermAndType(searchTxt, 'people').then(function(response) {
                        response = response.data;
                        $scope.ajaxSearchSpinner_People = false;
                        if (typeof response != "string") {
                            $scope.peopleNoContent = false;
                            if (response == null || response.length == 0) {
                                $scope.peopleList = null;
                            } else if ($scope.isTxtLengthQualify) {
                                $scope.searchReady = true;
                                if ($scope.SearchText == response.SearchText) {
                                    $scope.peopleList = response.people;
                                }
                            }
                            //analytics
                            analyticsService.TrackSearch('People_Search', "search: " + response.SearchText, (typeof response.people != 'undefined' ? response.people.length : 0));
                        } else {
                            $scope.peopleNoContent = true;
                        }
                    }, function(response) { // optional
                        $scope.peopleNoContent = true;
                        $scope.ajaxSearchSpinner_People = false;
                    });
                }
            }
            //timer function
        var timer;

        function keyDown() {
            console.log(timer);
            if (timer) {
                clearTimeout(timer);
                timer = setTimeout(populateSearchResult, 1000);
            } else {
                timer = setTimeout(populateSearchResult, 1000);
            }
        }

        function poupulateDetailArea(response) {
            if (response) {
                $scope.detailList = response;
                $scope.detailList = listToMatrix($scope.detailList, 2);
                $scope.GetDescription();
            } else {
                $scope.detailList = null;
            }
            //this function splits a linear object array into n dimensional object array
        }

        function listToMatrix(list, elementsPerSubArray) {
                var matrix = [],
                    i, k;
                if (list) {
                    for (i = 0, k = -1; i < list.length; i++) {
                        if (i % elementsPerSubArray === 0) {
                            k++;
                            matrix[k] = [];
                        }
                        matrix[k].push(list[i]);
                    }
                }
                return matrix;
            }
            //show the main search page
        $scope.ShowMainFilter = function(source) {
            $scope.isfilterArea = true;
        };
        //show the main search page
        $scope.clearData = function() {
            $scope.detailList = $scope.data[DETAILS_CATEGORY_MOVIE_TV] = $scope.data[DETAILS_CATEGORY_LIVE] = $scope.peopleList = null;
            $scope.isfilterArea = true;
            $scope.searchReady = false;
            $scope.isTxtLengthQualify = false;
            $scope.peopleHeading = $scope.liveHeading = $scope.vodHeading = false;
            $scope.ajaxSearchSpinner_Movie = $scope.ajaxSearchSpinner_Live = $scope.ajaxSearchSpinner_People = false;
            $scope.liveNoContent = $scope.peopleNoContent = $scope.vodNoContent = false;
        }
    }
]);
//controller ends here