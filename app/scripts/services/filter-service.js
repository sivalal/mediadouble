'use strict';
// This service is user for populating the common filters used thoughout application
mdlDirectTvApp.factory('FilterService', ['CustomListSplitter', 'SearchService', '$routeParams', '$filter', '$http', '$rootScope', 'configuration', 'CookieService',
    function(CustomListSplitter, SearchService, $routeParams, $filter, $http, $rootScope, configuration, CookieService) {
        var FilterService = {
            //filter channel by page and sortorder set on appgrid
            ChannelFilter: function(trackList, sortKey, pagename) {
                var liveChannelsFromAppgrid = parseAppgridData($rootScope.appGridMetadata['live_channels']);
                var newTracklist = [];
                if (trackList.thumblistCarouselOneArr) {
                    angular.forEach(trackList.thumblistCarouselOneArr, function(trackValue, trackKey) {
                        if (liveChannelsFromAppgrid) {
                            angular.forEach(liveChannelsFromAppgrid, function(appgridTrackValue, appgridTrackKey) {
                                //set sort order 
                                if (appgridTrackValue["channel_id"] == trackValue.channelId) {
                                    trackList.thumblistCarouselOneArr[trackKey].sort = appgridTrackValue[sortKey];
                                }
                                //set page wise check of channel availability
                                if ((appgridTrackValue["channel_id"] == trackValue.channelId) && (typeof appgridTrackValue.pages !== "undefined") && (appgridTrackValue.pages.hasOwnProperty(pagename)) && (appgridTrackValue.pages[pagename] == false)) {
                                    delete trackList.thumblistCarouselOneArr[trackKey];
                                }
                            });
                            console.log(trackList.thumblistCarouselOneArr[trackKey]);
                            if (typeof trackList.thumblistCarouselOneArr[trackKey] != "undefined" && $rootScope.empty(trackList.thumblistCarouselOneArr[trackKey]["sort"])) {
                                trackList.thumblistCarouselOneArr[trackKey].sort = {
                                    en_US: "500",
                                    es_ES: "500"
                                };
                            }
                            if (typeof trackList.thumblistCarouselOneArr[trackKey] != "undefined") {
                                newTracklist.push(trackList.thumblistCarouselOneArr[trackKey]);
                            }
                        }
                    });
                }
                console.log("inside filter live------------");
                console.log("page name " + pagename + " sort key" + sortKey);
                console.log(newTracklist);
                return newTracklist;
            },
            // ProgramFilter: function() {
            //   var currentDate = new Date();
            //   var date        = $filter('date')(currentDate, 'yyyy-MM-dd');
            //   var startTime   = (currentDate.getHours()<10?'0':'') + currentDate.getHours() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes() + ":00";
            //   var endTime     = (currentDate.getHours()<10?'0':'') + currentDate.getHours() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes() + ":00";
            //   SearchService.GetTrackSegmentsContent(date, startTime, endTime).then(function (trackSegments) {
            //       //add segments to the corresponding language
            //       $scope.$watch("tracks", function (newValue, oldValue) {
            //           if ((typeof newValue !== "undefined") && (newValue !== '')) {
            //               $scope.ajaxTrackSpinner = false;
            //               angular.forEach(newValue, function(trachValue, trackKey) {
            //                   if(trachValue.channelId) {
            //                       var segmentByTrackid = jQuery.grep(trackSegments, function (segments) { return segments.track_id == trachValue.channelId });
            //                       if(segmentByTrackid.length !== 0) {
            //                           console.log("segments exist");
            //                           $scope.tracks[trackKey]["segment"] = segmentByTrackid[0];
            //                       } 
            //                   }
            //               });
            //           }
            //       });
            //       $scope.trackSegments = trackSegments;
            //   });
            // },
            //Function to populate region 
            RegionFilter: function(appgridFlag) {
                if (typeof appgridFlag !== 'undefined' && appgridFlag == "True") {
                    CookieService.GetRegionFilter(); //retieved the list of selected regions from cookie
                    if (typeof $rootScope.SelectedRegions == "undefined" || $rootScope.SelectedRegions == '') {
                        $rootScope.SelectedRegions = [];
                    }
                    $rootScope.showRegionfilter = true;
                    CookieService.SetRegionFilterStatus("true");
                    if (typeof $rootScope.RegionFilters == 'undefined') {
                        if (parseAppgridData($rootScope.appGridMetadata['filters'])) { //JSON.parse($rootScope.appGridMetadata['filters'])
                            var filter = parseAppgridData($rootScope.appGridMetadata['filters']).region_filter; //JSON.parse($rootScope.appGridMetadata['filters']).region_filter;
                            for (var i = 0; i < filter.length; i++) {
                                if ($rootScope.SelectedRegions.indexOf(filter[i].key) > -1) filter[i].isFilterSelected = true;
                                else filter[i].isFilterSelected = false;
                            }
                            $rootScope.RegionFilters_Master = filter;
                            $rootScope.RegionFilters = $rootScope.listToMatrix(filter, 3);
                        }
                    }
                } else {
                    CookieService.SetRegionFilterStatus("false");
                    $rootScope.showRegionfilter = false;
                }
            },
            GenreFilter: function(appgridFlag, pagename) {
                /*
                 * @param {string} key    -> appgrid message id
                 * @param {object} msgObj -> appgrid msg obj
                 * @returns {TranslationObj or null}
                 */
                function getTranslationObj(key, msgObj) {
                        var TranslationObjList = $filter('filter')(msgObj, {
                            id: key
                        });
                        return ((typeof TranslationObjList[0] !== 'undefined') ? TranslationObjList[0] : null);
                    }
                    /*
                     * Unshift the array with $val to push in the beginning of array
                     */
                function customShift(array, value) {
                    if (array) {
                        var test = [];
                        var i = 0;;
                        for (var k in array) {
                            if (array[k]["short_label"] == value) {
                                var item = array[k];
                                delete array[k];
                            } else {
                                test[i] = array[k];
                                i++;
                            }
                        }
                    }
                    test.unshift(item);
                    return test;
                }
                $rootScope.showGenre = true;
                $rootScope.genreWidth = 0;
                if (typeof $rootScope.genre != 'undefined') $rootScope.genreWidth = (190 * $rootScope.genre.length) + 20;
                if (typeof appgridFlag !== 'undefined' && appgridFlag == "True") {
                    var genre_list = parseAppgridData($rootScope.appGridMetadata['genrelist']); //(JSON.parse($rootScope.appGridMetadata['genrelist']));
                    var genreObj = new Array();
                    var singlegenre = {};
                    for (var k in genre_list) {
                        singlegenre = {};
                        if ((typeof genre_list[k].pages !== "undefined") && (genre_list[k].pages.hasOwnProperty(pagename)) && (genre_list[k].pages[pagename] == true)) {
                            singlegenre.short_label = genre_list[k].id;
                            singlegenre.label = {};
                            singlegenre.label.en_US = genre_list[k].title.en_US;
                            singlegenre.label.es_ES = genre_list[k].title.es_ES;
                            genreObj.push(singlegenre);
                        }
                    }
                    $rootScope.genre = {};
                    var usGenre = _.sortBy(genreObj, function(singlegenre) {
                        return singlegenre.label.en_US.toLowerCase();
                    });
                    //console.log("sorted_>>"+usGenre.length);
                    console.log(usGenre);
                    var esGenre = _.sortBy(genreObj, function(singlegenre) {
                        return singlegenre.label.es_ES.toLowerCase();
                    });
                    //shift the given value to the beginning of the array
                    usGenre = customShift(usGenre, "ALL");
                    esGenre = customShift(esGenre, "ALL");
                    $rootScope.genreListUnsplitedObjArr = usGenre;
                    $rootScope.genre['en_US'] = usGenre; //CustomListSplitter(usGenre,8);
                    //$rootScope.genreWidth=(190*$rootScope.genre['en_US'].length)+20;
                    $rootScope.genre['es_ES'] = esGenre; //CustomListSplitter(esGenre,8);
                    $rootScope.genre['en_US']['count'] = usGenre.length;
                    $rootScope.genre['es_ES']['count'] = esGenre.length;
                } else {
                    $rootScope.showGenre = false;
                }
            },
            DiscoverFilter: function(appgridFlag, discoverType) {
                if (typeof appgridFlag !== 'undefined' && appgridFlag == "True") {
                    $rootScope.SelectedGroupFilter = {
                        "en_US": "SELECT",
                        "es_ES": "SELECCIONAR"
                    };
                    $rootScope.showDiscoverfilter = true;
                    if (typeof $rootScope.Sort_drop_down == 'undefined') {
                        if (parseAppgridData($rootScope.appGridMetadata['filters'])) { //JSON.parse($rootScope.appGridMetadata['filters'])
                            var filter = parseAppgridData($rootScope.appGridMetadata['filters']); // JSON.parse($rootScope.appGridMetadata['filters']);
                            $rootScope.Sort_drop_down = filter.group_filter;
                        }
                    }
                    for (var i = 0; i < $rootScope.Sort_drop_down.length; i++) {
                        if ($rootScope.Sort_drop_down[i].key == discoverType) {
                            $rootScope.SelectedGroupFilter = $rootScope.Sort_drop_down[i].title;
                            break;
                        }
                    }
                } else {
                    $rootScope.showDiscoverfilter = false;
                }
            },
            QualityFilter: function(appgridFlag) {
                if (typeof appgridFlag !== 'undefined' && appgridFlag == "True") {
                    CookieService.GetQualityFilter(); //retieved the list of selected regions from cookie
                    if (typeof $rootScope.SelectedQuality == "undefined") {
                        $rootScope.SelectedQuality = [];
                    }
                    $rootScope.showQuality = true;
                    CookieService.SetQualityFilterStatus("true");
                    if (typeof $rootScope.QualityFilters == 'undefined') {
                        if (parseAppgridData($rootScope.appGridMetadata['filters'])) { //JSON.parse($rootScope.appGridMetadata['filters'])
                            var filter = parseAppgridData($rootScope.appGridMetadata['filters']).quality_filter; //JSON.parse($rootScope.appGridMetadata['filters']).quality_filter;
                            for (var i = 0; i < filter.length; i++) {
                                if ($rootScope.SelectedQuality.indexOf(filter[i].key) > -1) filter[i].isFilterSelected = true;
                                else filter[i].isFilterSelected = false;
                            }
                            $rootScope.QualityFilters = filter;
                        }
                    }
                } else {
                    $rootScope.showQuality = false;
                    CookieService.SetQualityFilterStatus("false");
                }
            },
            ResetRegionFilter: function(selected_value) {
                var temp = $rootScope.RegionFilters_Master;
                for (var i = 0; i < $rootScope.RegionFilters_Master.length; i++) {
                    if ($rootScope.RegionFilters_Master[i].key == selected_value) $rootScope.RegionFilters_Master[i].isFilterSelected = true;
                    else $rootScope.RegionFilters_Master[i].isFilterSelected = false;
                }
                // $rootScope.RegionFilters_Master = filter;
                $rootScope.RegionFilters = $rootScope.listToMatrix($rootScope.RegionFilters_Master, 3);
                $rootScope.RegionFilters_Master = temp;
            },
            ResetQualityFilter: function(selected_value) {
                for (var i = 0; i < $rootScope.QualityFilters.length; i++) {
                    if ($rootScope.QualityFilters[i].key == selected_value) $rootScope.QualityFilters[i].isFilterSelected = true;
                    else $rootScope.QualityFilters[i].isFilterSelected = false;
                }
            }
        };
        return FilterService;
    }
]);