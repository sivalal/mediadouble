'use strict';
/* FilterPage Controller for 
 * 
action:filter, actionID: tv_recently_added
action:filter, actionID: tv_most_popular
action:filter, actionID: tv_recommended

action:filter, actionID: movie_recently_added
action:filter, actionID: movie_most_popular
action:filter, actionID: movie_recommended
 *  
 *    */
mdlDirectTvApp.controller('FilterPageCtrl', ['analyticsService', '$scope', 'Sessions', '$http', 'railService', 'configuration', '$rootScope', '$routeParams', 'FilterService', 'CookieService',
    function(analyticsService, $scope, Sessions, $http, railService, configuration, $rootScope, $routeParams, FilterService, CookieService) {
        function updateRails() {
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '/movie';
            var assetType = ($scope.Source == "tv" ? ["tv_season", "tv_series", "tv_episode", "tv_show"] : ["feature_film", "short_film"]);
            var tvTypes = {};
            tvTypes.types = assetType;
            var type = JSON.stringify(tvTypes);
            $scope.type = type;
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, type);
            }
        }
        $rootScope.CurrentPagename = $scope.pagename = $routeParams.pageid;
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
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //-----------rails common code--------------------
            updateRails();
        }); //end of $scope.$on('ngRepeatFinished'  
        $scope.GenreType = "TXT_GENRE_SUBSCRIBER"; //"GENRE";//important do remove not used for translate logic
        $scope.Source = "";
        $scope.imageMetaDetails = [];
        $scope.myInterval = 5000;
        // set interval in sec
        $scope.slides = [];
        //set slides array
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                var dimension = device['webDesktop']['rail.standard'];
                $scope.newbase = imgbase + '/' + dimension + '/';
                $scope.railList = [];
                $rootScope.CurrentPagename = $scope.pagename = $scope.pageid;
                if (typeof $routeParams.pageid != 'undefined') {
                    $scope.pageid = $routeParams.pageid;
                    $scope.pageDetails = $rootScope.getPageDetails($scope.pageid);
                    // $scope.queryoptions = JSON.stringify($scope.pageDetails.queryoptions);
                    try {
                        console.log("Parsing pageDetails.queryoptions");
                        $scope.pageDetails.queryoptions = parseAppgridData($scope.pageDetails.queryoptions);
                        console.log("success");
                        console.log($scope.pageDetails.queryoptions);
                    } catch (e) {}
                    $scope.PageType = ($scope.pageid.indexOf('tv_') != -1 || $scope.pageid.indexOf('movie_') != -1) ? $scope.getQueryType($scope.pageid) : $scope.pageid; //$scope.pageDetails.query;
                    $scope.TitleDisplay = $scope.pageDetails.title;
                }
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (!$scope.TitleDisplay && typeof $scope.pageDetails.title !== 'undefined') $scope.TitleDisplay = $scope.pageDetails.title;
                    if (typeof $scope.pageDetails.genrefilter != 'undefined') FilterService.GenreFilter($scope.pageDetails.genrefilter, $routeParams.pageid);
                    if (typeof $scope.pageDetails.regionfilter != 'undefined') FilterService.RegionFilter($scope.pageDetails.regionfilter);
                    if (typeof $scope.pageDetails.discoverfilter != 'undefined') FilterService.DiscoverFilter($scope.pageDetails.discoverfilter, $routeParams.group);
                    if (typeof $scope.pageDetails.regionfilter != 'undefined') FilterService.QualityFilter($scope.pageDetails.regionfilter);
                    $scope.railList = $scope.pageDetails['items'];
                    console.log('Complete items obj');
                    console.log($scope.railList);
                    $scope.VisiblerailList = [];
                    $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
                    if (typeof $scope.pageDetails.mastheads !== 'undefined') {
                        railService.populateShowcase($scope.pageDetails.mastheads, $scope);
                        console.log("SLides object");
                        console.log($scope.slides);
                    }
                    $scope.imageMetaDetails = {
                        "imageshackBaseurl": imgbase,
                        "deviceArr": parseAppgridData($rootScope.appGridMetadata.device) //JSON.parse($rootScope.appGridMetadata.device)
                    };
                    $scope.MakeMainGridRailCalls();
                }
            }
        }); //end of $rootScope.$watch"appGridMetadata"
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            railService.reloadSingleRailorGridUsingFirstMatchingQuery('live', $scope.VisiblerailList, $scope.type, null, null);
        });
        $scope.getQueryType = function(pageid) {
            var query_type = '';
            var Omni_pagetype = '';
            switch (pageid) {
                case 'tv_recently_added':
                    query_type = 'recently_added';
                    Omni_pagetype = 'recently added';
                    $scope.Source = "tv";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_TV_EXISTING_ACCOUNT";
                    break;
                case 'tv_most_popular':
                    query_type = 'most_popular';
                    Omni_pagetype = 'most popular';
                    $scope.Source = "tv";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_TV_EXISTING_ACCOUNT";
                    break;
                case 'tv_recommended':
                    query_type = 'recommended';
                    Omni_pagetype = 'recommended';
                    $scope.Source = "tv";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_TV_EXISTING_ACCOUNT";
                    break;
                case 'movie_recently_added':
                    query_type = 'recently_added';
                    Omni_pagetype = 'recently added';
                    $scope.Source = "movies";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_MOVIES_EXISTING_ACCOUNT";
                    break;
                case 'movie_most_popular':
                    query_type = 'most_popular';
                    Omni_pagetype = 'most popular';
                    $scope.Source = "movies";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_MOVIES_EXISTING_ACCOUNT";
                    break;
                case 'movie_recommended':
                    query_type = 'recommended';
                    Omni_pagetype = 'recommended';
                    $scope.Source = "movies";
                    $scope.SourceNAME = "TXT_TOP_TOOLBAR_MOVIES_EXISTING_ACCOUNT";
                    break;
                default:
                    query_type = null;
                    $scope.Source = "";
            }
            if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined') {
                $scope.Source = railService.getSourceName($scope.pageDetails.genrefilteroptions);
                if ($scope.Source == 'tv') $scope.SourceNAME = "TXT_TOP_TOOLBAR_TV_EXISTING_ACCOUNT";
                else if ($scope.Source == 'movies') $scope.SourceNAME = "TXT_TOP_TOOLBAR_MOVIES_EXISTING_ACCOUNT";
            }
            $scope.OmnituretrackFilterpageLoad($scope.Source, Omni_pagetype);
            return query_type;
        }
        $scope.OmnituretrackFilterpageLoad = function(source, Omni_pagetype) {
            source = (source == 'movies') ? 'movie' : source;
            var Omnipagename = source + ':' + Omni_pagetype;
            var Omniprop9 = source + ':' + Omni_pagetype;
            analyticsService.TrackFilterPageLoad(Omnipagename, Omniprop9);
        }
        $scope.RegionFilterUpdated = function(key, event) {
            if (typeof $rootScope.SelectedRegions === 'undefined') {
                $rootScope.SelectedRegions = [];
            }
            var checkbox = event.target;
            if (checkbox.checked) {
                $rootScope.SelectedRegions.push(key);
            } else {
                var index = $rootScope.SelectedRegions.indexOf(key);
                if (index > -1) {
                    $rootScope.SelectedRegions.splice(index, 1);
                }
            }
            CookieService.SaveRegionFilter($rootScope.SelectedRegions);
            $scope.ContentList = [];
            $scope.MakeMainGridRailCalls();
        }
        $scope.MakeMainGridRailCalls = function() {
            if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null && typeof($scope.pageDetails.query !== 'undefined')) {
                var urlPerQuery = "";
                switch ($scope.pageDetails.query) {
                    case 'last_added':
                        //        var amount=(typeof  $scope.pageDetails.queryoptions!=='undefined' && typeof  $scope.pageDetails.queryoptions.amount!=='undefined')? $scope.pageDetails.queryoptions.amount:10;
                        //       urlPerQuery = "/search/getRecentlyAdded?group_type=recently_added&amount="+amount;
                        urlPerQuery = (typeof $scope.pageDetails.queryoptions !== 'undefined' ? ("/searchApi/getRecentlyAdded?queryoptions=" + $scope.pageDetails.queryoptions + "&amount=" + $scope.pageDetails.itemcount) : "/searchApi/getRecentlyAdded?group_type=recently_added"
                            //JSON.stringify($scope.pageDetails.queryoptions
                        );
                        break;
                    case 'recommended':
                        // urlPerQuery = "/group/GetGroupResult?group_type=recommended";
                        //                    var psk='';
                        //                    if(typeof $scope.pageDetails.queryoptions !=='undefined'){
                        //                        if($scope.Source=='tv'){
                        //                            psk=$scope.pageDetails.queryoptions.path;
                        //                        }else if($scope.Source=='movies'){
                        //                            psk=$scope.pageDetails.queryoptions.path;
                        //                        }
                        //                   }
                        // var psk = "recommended";
                        var psk = (typeof $scope.pageDetails.queryoptions !== 'undefined' && typeof $scope.pageDetails.queryoptions.path !== 'undefined') ? $scope.pageDetails.queryoptions.path : '';
                        urlPerQuery = "/singleasset/getDiscoveryItems?" + psk;
                        if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined' && typeof $scope.pageDetails.genrefilteroptions.types != 'undefined') {
                            var assetTypes = {};
                            assetTypes.types = $scope.pageDetails.genrefilteroptions.types;
                            var type = JSON.stringify(assetTypes);
                            urlPerQuery = "/singleasset/getDiscoveryItems?" + psk + "&assetType=" + type;
                        }
                        break;
                    case 'most_popular':
                        // urlPerQuery = "/group/GetGroupResult?group_type=most_popular";
                        //var psk = "most_popular";
                        //                    var psk='';
                        //                    if(typeof $scope.pageDetails.queryoptions !=='undefined'){
                        //                    if($scope.Source=='tv'){
                        //                        psk=$scope.pageDetails.queryoptions.path;
                        //                    }else if($scope.Source=='movies'){
                        //                        psk=$scope.pageDetails.queryoptions.path;
                        //                    }
                        //                }
                        var psk = (typeof $scope.pageDetails.queryoptions !== 'undefined' && typeof $scope.pageDetails.queryoptions.path !== 'undefined') ? $scope.pageDetails.queryoptions.path : '';
                        urlPerQuery = "/singleasset/getDiscoveryItems?" + psk;
                        if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined' && typeof $scope.pageDetails.genrefilteroptions.types != 'undefined') {
                            var assetTypes = {};
                            assetTypes.types = $scope.pageDetails.genrefilteroptions.types;
                            var type = JSON.stringify(assetTypes);
                            urlPerQuery = "/singleasset/getDiscoveryItems?" + psk + "&assetType=" + type;
                        }
                        break;
                    case 'discovery':
                        var psk = (typeof $scope.pageDetails.queryoptions !== 'undefined' && typeof(JSON.parse($scope.pageDetails.queryoptions)).path !== 'undefined') ? JSON.parse($scope.pageDetails.queryoptions).path : '';
                        urlPerQuery = "/singleasset/getDiscoveryItems?" + psk;
                        if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined' && typeof JSON.parse($scope.pageDetails.genrefilteroptions).types != 'undefined') {
                            var assetTypes = {};
                            assetTypes.types = JSON.parse($scope.pageDetails.genrefilteroptions).types;
                            var type = JSON.stringify(assetTypes);
                            urlPerQuery = "/singleasset/getDiscoveryItems?" + psk + "&assetType=" + type;
                        }
                        break;
                }
                var call_url = configuration.server_url + urlPerQuery;
                $http({
                    method: 'Get',
                    url: call_url
                }).success(function(data, status, headers, config) {
                    var result_data = data.thumblistCarouselOneArr;
                    for (var i in result_data) {
                        // console.log(itemHtml(data["thumblistCarouselOneArr"][i]));
                        // console.log(result_data[i].title[$rootScope.CurrentLang]);
                        if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                            if (result_data[i]['imagePath'].indexOf('dummy/blank_image.png') === -1) {
                                result_data[i]['imagePath'] = $scope.newbase + result_data[i]['imagePath'];
                            } else {
                                result_data[i]['imagePath'] = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                            }
                        }
                    }
                    $scope.ContentList = result_data;
                    if (typeof($scope.pageDetails.query !== 'undefined') && $scope.pageDetails.query != 'last_added') {
                        if (typeof $scope.ContentList !== 'undefined') {
                            for (var i = 0; i < $scope.ContentList.length; i++) {
                                $http.get(configuration.server_url + '/searchApi/GetSearchMiniContent?contentId=' + $scope.ContentList[i].id + '&position=' + i).
                                success(function(data, status, headers, config) {
                                    if (data.imagePath && data.position) {
                                        $scope.ContentList[data.position].source = data.source;
                                        $scope.ContentList[data.position].content_type = data.content_type;
                                        $scope.ContentList[data.position].show_type = data.show_type;
                                        $scope.ContentList[data.position].title = data.title;
                                        $scope.ContentList[data.position].title_showname = data.title_showname;
                                        $scope.ContentList[data.position].title_season_episode = data.title_season_episode;
                                        if (typeof $rootScope.appGridMetadata['device'] !== 'undefined' && data.imagePath.indexOf('dummy/blank_image.png') === -1) {
                                            $scope.ContentList[data.position].imagePath = $scope.newbase + data.imagePath;
                                        } else {
                                            $scope.ContentList[data.position].imagePath = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                        }
                                    } else if (data.asset == null || data.asset == 'null') {
                                        $scope.ContentList[data.position].hideElement = true;
                                    }
                                }).error(function(data, status, headers, config) {
                                    $scope.message = 'Unexpected Error';
                                });
                            }
                        }
                    } //end of if
                }).error(function(data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
            } //end of get page details. if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null)
        };
        $scope.QualityFilterUpdated = function(key, event) {
            $rootScope.SelectedQuality = [];
            var checkbox = event.target;
            if (checkbox.checked) {
                $rootScope.SelectedQuality.push(key);
            } else {
                var index = $rootScope.SelectedQuality.indexOf(key);
                if (index > -1) {
                    $rootScope.SelectedQuality.splice(index, 1);
                }
            }
            CookieService.SaveQualityFilter($rootScope.SelectedQuality);
            $scope.ContentList = [];
            $scope.MakeMainGridRailCalls();
        }
        $scope.callToAction = function(slide) {
            if (slide.cta) {
                if (typeof slide.actionid == 'undefined') {
                    return null;
                } else if (slide.action == 'custom') {
                    return "/" + "page?pageid=" + slide.actionid;
                } else if (slide.action == 'filter') {
                    return "/" + "filterpage?pageid=" + slide.actionid;
                } else if (slide.action == 'link') {
                    return slide.actionid;
                } else {
                    return "/" + slide.actionid;
                }
            }
        };
        $scope.isUndefinedOrNull = function(val) {
            //console.log('Check-->');
            //console.log(val);
            //console.log('Resp:')
            var k = angular.isUndefined(val) || val === null;
            //console.log(k);
            return k;
        };
        //fix for 404 issue angular carousal.
        $scope.addbaseAndImg = function(base, imgpath) {
            if (typeof imgpath != 'undefined') {
                return base + (imgpath.replace("https", "http"));
            } else {
                return ""; //no image 
            }
        };
    }
]);