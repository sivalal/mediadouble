//controller for the content inside search modal template
mdlDirectTvApp.controller('DropdownCtrl', ['analyticsService', '$scope', '$http', 'SearchService', 'configuration', '$rootScope',
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
                var imgbase = (JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = (JSON.parse($rootScope.appGridMetadata['device']));
                var dimension_large = device['webDesktop']['rail.standard'];
                $scope.newbase_large = imgbase + '/' + dimension_large + '/';
                var dimension = device['webDesktop']['search'];
                $scope.newbase = imgbase + '/' + dimension + '/';
            }
        });
        //function will be fired with every key stroke of searcht text
        $scope.SearchTextUpdated = function(searchTxt) {
            //checks if search is ready
            $scope.SearchText = searchTxt;
            if (searchTxt.length > 2) {
                keyDown(); //function to populate items
                // if (!$scope.isfilterArea) // checks whether user is currently in filter details page
                // {
                //     poupulateDetailArea();
                // }
                $scope.isTxtLengthQualify = true;
            } else {
                $scope.clearData();
            }
        };
        //invoked when the see all button is pressed
        //fills out the details for search details page
        $scope.ClickSeeAll = function(source) {
            $scope.peopleContent = false;
            $scope.isfilterArea = false;
            $scope.SrchDetailHead = source;
            $scope.detailList = null;
            switch (source) {
                case "LIVE":
                    $scope.Detailcategory = DETAILS_CATEGORY_LIVE;
                    $scope.detailList = $scope.data[DETAILS_CATEGORY_LIVE];
                    break;
                case "PEOPLE":
                    $scope.Detailcategory = DETAILS_CATEGORY_PEOPLE;
                    $scope.detailList = $scope.data[DETAILS_CATEGORY_MOVIE_TV];
                    console.log($scope.detailList);
                    // var list="";
                    // for(var item=0;item<$scope.peopleList.length;item++)
                    // {
                    //     list=list+$scope.peopleList[item].title;
                    // }
                    // debugger;
                    break;
                case "MOVIES & TV SHOWS":
                    $scope.Detailcategory = DETAILS_CATEGORY_MOVIE_TV;
                    $scope.detailList = $scope.data[DETAILS_CATEGORY_MOVIE_TV];
                    break;
            }
            if ($scope.detailList != null) {
                //  $scope.titleIds = listOfTitleIds($scope.detailList);
                poupulateDetailArea($scope.detailList);
            }
            // console.log($scope.detailList);
            // console.log($scope.titleIds);
        };
        $scope.singlePeopleSearch = function(name) {
            $scope.isfilterArea = false;
            $scope.detailList = null;
            $scope.SrchDetailHead = 'PEOPLE';
            $scope.ajaxPeopleDetailsSpinner = true;
            $scope.detailList = null;
            $scope.clickedPeopleName = name;
            $http.get(configuration.server_url + '/search/PeopleSearchDetail?name=' + name).then(function(response, headers) {
                $scope.peopleContent = true;
                $scope.ajaxPeopleDetailsSpinner = false;
                response = response.data;
                $scope.detailList = response;
            });
        };
        //gets the content description required from see all page
        $scope.GetDescription = function() {
            for (var i = 0; i < $scope.detailList.length; i++) {
                for (var j = 0; j < $scope.detailList[i].length; j++) {
                    var position = i + '_' + j;
                    $http.get(configuration.server_url + '/search/GetSummary?contentId=' + $scope.detailList[i][j].id + '&position=' + position).
                    success(function(data, status, headers, config) {
                        if (data.position) {
                            $scope.detailList[data.position.split("_")[0]][data.position.split("_")[1]].title = (data.lang) ? data.lang.title[$rootScope.CurrentLang] : '';
                            $scope.detailList[data.position.split("_")[0]][data.position.split("_")[1]].desc = (data.lang) ? data.lang.details[$rootScope.CurrentLang] : '';
                        }
                    });
                };
            }
        }

        function listOfTitleIds(obj) {
                var titleIds = [],
                    rows = 0;
                if (obj) {
                    rows = obj.length;
                    console.log(rows);
                    for (var i = 0; i < obj.length; ++i) {
                        for (var ind in obj[i]) {
                            if (ind === 'id') {
                                console.log(obj[i][ind]);
                                titleIds.push(obj[i][ind]);
                            }
                        }
                    }
                }
                return titleIds;
            }
            //populates the data for individual sections eg : tv&movie , peopl, live 
        $scope.populate_IndividulaSection = function(SECTION, response) {
            //checks if response from server is valid
            if (response == null || !response.data || response.length == 0) {
                $scope.data[SECTION] = null;
                if ($scope.Detailcategory == SECTION && !$scope.isfilterArea) {
                    $scope.detailList = null;
                }
            } else if ($scope.isTxtLengthQualify) {
                $scope.searchReady = true;
                //checks if the search text matched wth value currently diplayed in screen
                if ($scope.SearchText == response.SearchText) {
                    $scope.data[SECTION] = response.data;
                    if (!$scope.isfilterArea && $scope.Detailcategory == SECTION) {
                        $scope.detailList = $scope.data[SECTION];
                    }
                    for (var i = 0; i < $scope.data[SECTION].length; i++) {
                        $http.get(configuration.server_url + '/search/GetSearchMiniContent?contentId=' + $scope.data[SECTION][i].id + '&position=' + i).
                        success(function(data, status, headers, config) {
                            if (data.imagePath && data.position) {
                                if (typeof $rootScope.appGridMetadata['device'] !== 'undefined' && data.imagePath.indexOf('dummy/blank_image.png') === -1) {
                                    $scope.data[SECTION][data.position].imagePath = $scope.newbase + data.imagePath;
                                    $scope.data[SECTION][data.position].imagePath_large = $scope.newbase_large + data.imagePath;
                                } else {
                                    $scope.data[SECTION][data.position].imagePath = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                    $scope.data[SECTION][data.position].imagePath_large = $scope.newbase_large + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                }
                                $scope.data[SECTION][data.position].source = data.source;
                                $scope.data[SECTION][data.position].titleType = data.titleType;
                                $scope.data[SECTION][data.position].content_type = data.content_type;
                                $scope.data[SECTION][data.position].source_path = data.source + "?titleId=" + data.id;
                                if ($scope.Detailcategory == SECTION && !$scope.isfilterArea) {
                                    poupulateDetailArea($scope.data[SECTION]);
                                }
                            }
                        }).error(function(data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            }
        }

        function populateSearchResult() {
                if ($scope.SearchText.length > 2) {
                    var searchTxt = $scope.SearchText;
                    //start all spinners
                    $scope.ajaxSearchSpinner_Movie = $scope.ajaxSearchSpinner_Live = $scope.ajaxSearchSpinner_People = true;
                    // Call the async method and then do stuff with what is returned inside our own then function
                    SearchService.Get_Live_SearchResult(searchTxt).then(function(response) {
                        $scope.ajaxSearchSpinner_Live = false;
                        $scope.populate_IndividulaSection(DETAILS_CATEGORY_LIVE, response);
                        //analytics
                        analyticsService.TrackSearch('Live_Search', response.SearchText, (typeof response.data != 'undefined' ? response.data.length : 0));
                    });
                    //server call for tv/movie search
                    SearchService.Get_TV_Movie_SearchResult(searchTxt).then(function(response) {
                        $scope.ajaxSearchSpinner_Movie = false;
                        $scope.populate_IndividulaSection(DETAILS_CATEGORY_MOVIE_TV, response);
                        //analytics
                        analyticsService.TrackSearch('TV_Movie_Search', response.SearchText, (typeof response.data != 'undefined' ? response.data.length : 0));
                    });
                    //get result for people search
                    SearchService.Get_People_SearchResult(searchTxt).then(function(response) {
                        $scope.ajaxSearchSpinner_People = false;
                        if (response == null || response.length == 0) {
                            $scope.peopleList = null;
                        } else if ($scope.isTxtLengthQualify) {
                            $scope.searchReady = true;
                            if ($scope.SearchText == response.SearchText) {
                                $scope.peopleList = response.people;
                            }
                        }
                        //analytics
                        analyticsService.TrackSearch('People_Search', response.SearchText, (typeof response.people != 'undefined' ? response.people.length : 0));
                    });
                }
            }
            //timer function
        var timer;

        function keyDown() {
            if (timer) {
                clearTimeout(timer);
                timer = setTimeout(populateSearchResult, 200);
            } else {
                timer = setTimeout(populateSearchResult, 200);
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
            $scope.ajaxSearchSpinner_Movie = $scope.ajaxSearchSpinner_Live = $scope.ajaxSearchSpinner_People = false;
        }
    }
]);
//controller ends here