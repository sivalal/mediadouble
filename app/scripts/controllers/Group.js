'use strict';
/* Group-Filter Controllers */
mdlDirectTvApp.controller('GroupCtrl', ['analyticsService', '$filter', '$scope', '$http', 'configuration', '$rootScope', '$routeParams', 'FilterService', 'CookieService', 'railService',
    function(analyticsService, $filter, $scope, $http, configuration, $rootScope, $routeParams, FilterService, CookieService, railService) {
        //$scope.GenreType = $routeParams.group.replace("_", " ");
        function capitaliseFirstCharacter(input) {
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
        $scope.selected_genre = $routeParams.group;
        $scope.DefaultGenreType = "TXT_GENRE_SUBSCRIBER"; //"GENRE";
        if (typeof $routeParams.pagetype != 'undefined') {
            $scope.PageType = $routeParams.pagetype;
            //            $scope.GenreType = ($routeParams.group=='all'?'ALL_GENRES':capitaliseFirstCharacter($routeParams.group));
            //            $scope.TitleDisplay = {
            //                "en_US": $scope.GenreType,
            //                "es_ES": $scope.GenreType
            //            };
        } else if (typeof $routeParams.group != 'undefined') $scope.PageType = $routeParams.group;
        if (typeof $routeParams.source != 'undefined') {
            $scope.Source = $routeParams.source;
            $scope.israils_grid = false;
        } else {
            $scope.Source = '';
        }
        console.log("Group page Source name");
        console.log($scope.Source);
        console.log("$routeParams.source Source name");
        console.log($routeParams.source);
        console.log("initial PageType==page---> type ==>" + $scope.PageType);
        $scope.CurrentDataLive = "";
        // $scope.appgrid_page = $routeParams.group;
        // if ($scope.PageType) {
        //   $scope.appgrid_page = $scope.PageType;
        //   $scope.GroupType = {
        //     "en_US": $scope.GenreType,
        //     "es_ES": $scope.GenreType
        //   };
        // } else {
        //   $scope.GenreType = "GENRE";
        // }
        $scope.imageMetaDetails = [];
        $rootScope.$watch("appgridAssets", function(newValue, oldValue) {
            if (newValue != '') {
                var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                var dimension = device['webDesktop']['rail.standard'];
                $scope.newbase = imgbase + '/' + dimension + '/';
                $scope.railList = [];
                if (typeof $routeParams.pageid != 'undefined') {
                    var position = 0;
                    if (typeof $routeParams.position != 'undefined') position = $routeParams.position;
                    $rootScope.CurrentPagename = $scope.pageid = $routeParams.pageid;
                    $scope.railPageDetails = $rootScope.getPageDetails($scope.pageid);
                    $scope.railPageDetails_itemlist = $scope.railPageDetails.items;
                    var required_Item = $scope.railPageDetails_itemlist[position];
                    $scope.railItemQueryOption = required_Item.queryoptions;
                    $scope.queryoptions = required_Item.queryoptions; //JSON.stringify(required_Item.queryoptions);
                    $scope.PageType = required_Item.query;
                    console.log("query PageType==page---> type ==>" + $scope.PageType);
                    $scope.TitleDisplay = required_Item.title;
                    $scope.pageDetails = $rootScope.getPageDetails("rails_grid");
                    $scope.israils_grid = true;
                    //analytics
                    var anlyPageName = $scope.pageid + "|rails_grid|" + $scope.TitleDisplay[$rootScope.CurrentLang];
                    analyticsService.TrackCustomPageLoad(anlyPageName);
                    jQuery(".partialContainer").removeClass("removeSecondContainer").addClass("removeSecondContainer");
                } else {
                    $scope.pageDetails = $rootScope.getPageDetails($scope.PageType);
                    //analytics
                    analyticsService.TrackGenrePage($scope.selected_genre);
                }
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (!$scope.TitleDisplay && typeof $scope.pageDetails.title !== 'undefined') $scope.TitleDisplay = $scope.pageDetails.title;
                    $scope.pagename = $routeParams.genresourceid;
                    FilterService.GenreFilter($scope.pageDetails.genrefilter, $routeParams.genresourceid);
                    if (typeof $routeParams.pagetype != 'undefined') {
                        //$scope.PageType = $routeParams.pagetype;
                        var genrelabelObjList = $filter('filter')($rootScope.genreListUnsplitedObjArr, {
                            short_label: $routeParams.group
                        });
                        var selectedGenreOBJ = ((typeof genrelabelObjList[0] !== 'undefined') ? genrelabelObjList[0] : null);
                        if (typeof selectedGenreOBJ != 'undefined' && selectedGenreOBJ != null && selectedGenreOBJ != '') {
                            $scope.GenreType = selectedGenreOBJ.label;
                            $scope.TitleDisplay = selectedGenreOBJ.label;
                        }
                        //       $scope.GenreType = item.label[CurrentLang]
                        //            $scope.TitleDisplay = {
                        //                "en_US": $scope.GenreType,
                        //                "es_ES": $scope.GenreType
                        //            };
                    }
                    FilterService.RegionFilter($scope.pageDetails.regionfilter);
                    FilterService.DiscoverFilter($scope.pageDetails.discoverfilter, $routeParams.group);
                    FilterService.QualityFilter($scope.pageDetails.regionfilter);
                    $scope.railList = $scope.pageDetails['items'];
                    if (typeof $scope.pageDetails.mastheads !== 'undefined') {
                        railService.populateShowcase($scope.pageDetails.mastheads, $scope);
                    }
                    $scope.imageMetaDetails = {
                        "imageshackBaseurl": imgbase,
                        "deviceArr": parseAppgridData($rootScope.appGridMetadata.device) //JSON.parse($rootScope.appGridMetadata.device)
                    };
                    $scope.MakeRailCalls();
                }
            }
        }); //end of $rootScope.$watch"appGridMetadata"
        $scope.myInterval = 5000;
        // set interval in sec
        $scope.slides = [];
        //set slides array
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
            //  FilterService.ResetRegionFilter(key);
            CookieService.SaveRegionFilter($rootScope.SelectedRegions);
            $scope.ContentList = [];
            $scope.MakeRailCalls();
        }
        $scope.genre_page_number = 1;
        $scope.genre_showmore = 'no';
        $scope.ajaxGenreSpinner = true;
        /*
         * infiniteScrollDisabled
         *
         */
        $scope.infiniteScrollDisabled = (typeof $scope.genre_showmore == 'undefined') ? true : ($scope.genre_showmore != 'yes');
        $scope.MakeRailCalls = function() {
                var Types = {};
                var assetType;
                if ($scope.Source.toLowerCase() == 'movie' || $scope.Source.toLowerCase() == 'movies') {
                    assetType = ["feature_film", "short_film"];
                    Types.types = assetType;
                } else {
                    //assetType=["tv_season","tv_series","tv_episode","tv_show"];
                    assetType = ["tv_series", "tv_show"];
                    Types.types = assetType;
                }
                var assettypeStr = JSON.stringify(Types);
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    var accountToken = $rootScope.accessToken;
                    var urlPerQuery = "";
                    console.log("MakeRailCalls PageType==page---> type ==>" + $scope.PageType);
                    if ($scope.PageType == 'xdr') {
                        urlPerQuery = "/searchApi/shortrailXDRdataCall?";
                    } else {
                        switch ($scope.PageType) {
                            case 'manual':
                                urlPerQuery = "/searchApi/manualrailShortCall?queryoptions=" + $scope.queryoptions;
                                break;
                            case 'similar':
                                urlPerQuery = "/search/getSimilarItemsInSap?embed_code=" + embedcodeDATA;
                                break;
                            case 'genre':
                                var pagesizeN = 20;
                                if (typeof $scope.pageDetails.itemcount != 'undefined') {
                                    console.log("got itemcount");
                                    //pagesizeN=$scope.pageDetails.itemcount;
                                    if ($scope.genre_page_number > 1) pagesizeN = 20;
                                    urlPerQuery = "/searchApi/GenreList?group_type=" + $scope.selected_genre + "&page_size=" + pagesizeN + "&page_number=" + $scope.genre_page_number;
                                } else {
                                    if ($scope.genre_page_number > 1) pagesizeN = 20;
                                    urlPerQuery = "/searchApi/GenreList?group_type=" + $scope.selected_genre + "&page_size=" + pagesizeN + "&page_number=" + $scope.genre_page_number;
                                }
                                //group/GenreList
                                if (typeof $scope.pageDetails != 'undefined' && typeof $scope.pageDetails.genrefilteroptions != 'undefined' && $scope.pageDetails.genrefilteroptions != 'null' && typeof(JSON.parse($scope.pageDetails.genrefilteroptions)).types != 'undefined') {
                                    urlPerQuery = urlPerQuery + "&types=" + $scope.pageDetails.genrefilteroptions; //JSON.stringify($scope.pageDetails.genrefilteroptions);
                                } else {
                                    urlPerQuery = urlPerQuery + "&types=" + assettypeStr;
                                }
                                $scope.infiniteScrollDisabled = true;
                                break;
                            case 'recommended':
                                urlPerQuery = "/group/GetGroupResult?group_type=recommended";
                                break;
                            case 'recently_added':
                                //   var amount=(typeof  $scope.pageDetails.queryoptions!=='undefined' && typeof  $scope.pageDetails.queryoptions.amount!=='undefined')? $scope.pageDetails.queryoptions.amount:'';
                                //   urlPerQuery = "/search/getRecentlyAdded?group_type=recently_added&amount="+amount;
                                //urlPerQuery = "/search/getRecentlyAdded?group_type=recently_added";
                                urlPerQuery = (typeof $scope.pageDetails.queryoptions !== 'undefined' ? "/searchApi/getRecentlyAdded?group_type=recently_added" : ("/searchApi/getRecentlyAdded?queryoptions=" + JSON.stringify($scope.pageDetails.queryoptions)));
                                break;
                            case 'last_added':
                                //        var amount=(typeof  $scope.pageDetails.queryoptions!=='undefined' && typeof  $scope.pageDetails.queryoptions.amount!=='undefined')? $scope.pageDetails.queryoptions.amount:10;
                                //       urlPerQuery = "/search/getRecentlyAdded?group_type=recently_added&amount="+amount;
                                urlPerQuery = (typeof $scope.pageDetails.queryoptions !== 'undefined' ? "/searchApi/getRecentlyAdded?group_type=recently_added" : ("/searchApi/getRecentlyAdded?queryoptions=" + $scope.pageDetails.queryoptions) //JSON.stringify($scope.pageDetails.queryoptions))
                                );
                                break;
                            case 'most_popular':
                                urlPerQuery = "/group/GetGroupResult?group_type=most_popular";
                                break;
                            case 'discovery':
                                var psk = (typeof(JSON.parse($scope.queryoptions)).path !== 'undefined') ? (JSON.parse($scope.queryoptions)).path : '';
                                if (typeof $scope.railItemQueryOption !== 'undefined' && typeof(JSON.parse($scope.railItemQueryOption)).path !== 'undefined') {
                                    // urlPerQuery = "/search/getSimilarOrDiscoveryItems?path=" + $scope.railItemQueryOption.path;
                                    urlPerQuery = "/singleasset/getDiscoveryAssetsShort?" + (JSON.parse($scope.railItemQueryOption)).path;
                                } else {
                                    //urlPerQuery = "/search/getSimilarOrDiscoveryItems?path=" + psk;
                                    urlPerQuery = "/singleasset/getDiscoveryAssetsShort?" + psk;
                                }
                                break;
                            case 'live':
                                urlPerQuery = "/live/getTrack?";
                                break;
                            default:
                                urlPerQuery = "/searchApi/railShortCall?queryoptions=" + $scope.queryoptions;
                                break;
                        }
                    }
                    var call_url = configuration.server_url + urlPerQuery;
                    $scope.ajaxGenreSpinner = true;
                    $http({
                        method: 'Get',
                        url: call_url
                    }).success(function(data, status, headers, config) {
                        if (typeof data.thumblistCarouselOneArr != 'undefined' && data.thumblistCarouselOneArr[0].show_type == "live") {
                            $scope.CurrentDataLive = data;
                            data = railService.SortLiveChannels(data);
                        }
                        var result_data = data.thumblistCarouselOneArr;
                        for (var i in result_data) {
                            if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                                if (result_data[i]['imagePath'].indexOf('dummy/blank_image.png') === -1) result_data[i]['imagePath'] = $scope.newbase + result_data[i]['imagePath'];
                                else result_data[i]['imagePath'] = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                            } //end of if (typeof $rootScope.appGridMetadata['device']
                            result_data[i]['single_asset_url'] = "";
                            if (result_data[i].show_type != 'live') {
                                result_data[i]['single_asset_url'] = "/" + result_data[i]['source'] + '?titleId=' + result_data[i]['id'];
                            } else if (result_data[i].show_type == 'live') {
                                result_data[i]['single_asset_url'] = $scope.getLiveAssetUrl(result_data[i].embed_code, result_data[i].channelId, result_data[i].title);
                            }
                        } //end of for loop
                        console.log("Result __data ::->");
                        console.log(result_data);
                        if (typeof $scope.ContentList == 'undefined') $scope.ContentList = result_data;
                        else if (typeof $scope.ContentList.length == 0) $scope.ContentList = result_data;
                        else {
                            if (typeof data.paginationDetails != 'undefined' && $scope.genre_page_number != data.paginationDetails.new_page_number) {
                                $scope.ContentList = $scope.ContentList.concat(result_data);
                            }
                        }
                        $scope.ajaxGenreSpinner = false;
                        if (typeof($scope.pageDetails.query !== 'undefined') && $scope.pageDetails.query == 'last_added') {
                            for (var i = 0; i < $scope.ContentList.length; i++) {
                                $http.get(configuration.server_url + '/search/GetSearchMiniContent?contentId=' + $scope.ContentList[i].id + '&position=' + i).
                                success(function(data, status, headers, config) {
                                    if (data.imagePath && data.position) {
                                        //                                    if(data.asset==null||data.asset=='null'){
                                        //                                        if($scope.ContentList.isArray()){
                                        //                                            $scope.ContentList.splice(data.position,1);
                                        //                                        }
                                        //                                    }else{
                                        $scope.ContentList[data.position].source = data.source;
                                        $scope.ContentList[data.position].content_type = data.content_type;
                                        if (typeof $rootScope.appGridMetadata['device'] !== 'undefined' && data.imagePath.indexOf('dummy/blank_image.png') === -1) {
                                            $scope.ContentList[data.position].imagePath = $scope.newbase + data.imagePath;
                                        } else {
                                            $scope.ContentList[data.position].imagePath = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                                        }
                                        //}
                                    }
                                }).error(function(data, status, headers, config) {
                                    $scope.message = 'Unexpected Error';
                                });
                            }
                        } //end of pageDetails not equal to undefined
                        if (typeof data.paginationDetails != 'undefined') {
                            $scope.genre_page_number = data.paginationDetails.new_page_number;
                            $scope.genre_showmore = data.paginationDetails.showmore;
                            $scope.infiniteScrollDisabled = $scope.genre_showmore != 'yes';
                        }
                    }).error(function(data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
            }
            /*
             * update live channel grid on language change
             */
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            ////////////////////////////////////////////////////
            var data = $scope.CurrentDataLive;
            if (typeof data.thumblistCarouselOneArr != 'undefined' && typeof data.thumblistCarouselOneArr[0] != 'undefined' && data.thumblistCarouselOneArr[0].show_type == "live") {
                data = railService.SortLiveChannels(data);
                var result_data = data.thumblistCarouselOneArr;
                for (var i in result_data) {
                    if (typeof $rootScope.appGridMetadata['device'] !== 'undefined') {
                        if (result_data[i]['imagePath'].indexOf('dummy/blank_image.png') === -1) result_data[i]['imagePath'] = $scope.newbase + result_data[i]['imagePath'];
                        else result_data[i]['imagePath'] = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
                    } //end of if (typeof $rootScope.appGridMetadata['device']
                    result_data[i].single_asset_url = "";
                    if (result_data[i].show_type != 'live') {
                        result_data[i].single_asset_url = "/" + result_data[i]['source'] + '?titleId=' + result_data[i]['id'];
                    } else if (result_data[i].show_type == 'live') {
                        result_data[i].single_asset_url = $scope.getLiveAssetUrl(result_data[i].embed_code, result_data[i].channelId, result_data[i].title);
                    }
                } //end of for loop                          
                if (typeof $scope.ContentList != 'undefined') {
                    $scope.ContentList = result_data;
                }
            }
            ////////////////////////////////////////////////////
        });
        /*
         * getLive Asset Url
         *
         * @returns {String} Live asset url
         */
        $scope.getLiveAssetUrl = function(embed_code, channelId, title) {
            return "/liveShow?content_id=" + embed_code + "&id=" + channelId + "&title=" + title;
        }
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
            $scope.MakeRailCalls();
        }
        $scope.callToAction = function(slide) {
            if (slide.cta) {
                if (typeof slide.actionID == 'undefined') {
                    return null;
                } else if (slide.action == 'custom') {
                    return "/" + "page?pageid=" + slide.actionID;
                } else if (slide.action == 'filter') {
                    return "/" + "filterpage?pageid=" + slide.actionID;
                } else if (slide.action == 'link') {
                    return slide.actionID;
                } else {
                    return "/" + slide.actionID;
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