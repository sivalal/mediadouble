'use strict';
mdlDirectTvApp.controller('adminNavCtrl', ['$scope', 'slidenav', '$http', '$location', '$modal', '$translate', '$rootScope', 'WatchListService', 'XDRService', 'Sessions', 'Authentication', 'AccountService', 'configuration', '$filter', 'Vindicia', 'dateFilter', 'analyticsService', 'SearchService', '$cookieStore',
    function adminNavCtrl($scope, slidenav, $http, $location, $modal, $translate, $rootScope, WatchListService, XDRService, Sessions, Authentication, AccountService, configuration, $filter, Vindicia, dateFilter, analyticsService, SearchService, $cookieStore) {
        //to restore the cookie values
        Sessions.GetUserData();
        $scope.currentLang = Sessions.getLanguage();
        $scope.baseUrl = configuration.server_url;
        //$scope.watchlistList=new Array();
        //active div click event
        $rootScope.selectedIndex = 0; //disable select first item for loading on click
        $rootScope.selectedAction = 'continue_watching'; //disable select first item for loading on click
        var menuItem_1 = true;
        var menuItem_2 = true;
        var menuItem_3 = true;
        var menuItem_4 = true;
        var menuItem_5 = true;
        $rootScope.templateName = 'views/admin/continueWatching.html';
        $rootScope.itemClicked = function($index, action) {
            /**
             * selected menu index
             */
            $rootScope.selectedIndex = $index;
            $rootScope.selectedAction = action;
            /**
             * selected menu template url
             */
            $rootScope.templateName = $rootScope.asideMenu[$index].path;
            //error/success container of admin sub pages
            $scope.activateNotification = false;
            $scope.deactivateNotification = false;
            $scope.billingEditError = false;
            $scope.billingEditSuccess = false;
            $scope.sucessCredentialEdit = false;
            $scope.errorCredentialEdit = false;
            $scope.successAccountLinking = false;
            $scope.errorSocialAccountLinking = false;
            $scope.errorAccountLinking = false;
            if (action == "continue_watching" && menuItem_1) {
                analyticsService.TrackCustomPageLoad("account:continue watching");
                menuItem_1 = true;
                $rootScope.ajaxContinueWatchlistSpinner = true;
                XDRService.GetList().then(function(response) {
                    $rootScope.continueWatchingList = (typeof response['thumblistCarouselOneArr'] != 'undefined') ? response['thumblistCarouselOneArr'] : null;
                    $rootScope.ajaxContinueWatchlistSpinner = false;
                });
            } else if (action == "watchlist" && menuItem_2) {
                analyticsService.TrackCustomPageLoad("account:playlist");
                $scope.watchlistFilterCombo = [{
                    label: 'BTN_ADMIN_ALL_WATCHLIST',
                    value: "all"
                }, {
                    label: 'HOVER_TXT_ADMIN_TVSHOWS_WATCHLIST',
                    value: "tvShow"
                }, {
                    label: 'HOVER_TXT_ADMIN_MOVIES_WATCHLIST',
                    value: "movie"
                }];
                $scope.selectedFilterValue = $scope.watchlistFilterCombo[0];
                $scope.playlistFilter = 'all';
                menuItem_2 = true;
                $scope.ajaxWatchlistSpinner = true;
                //gets list of items in wathclist
                WatchListService.Getlist().then(function(response) {
                    $scope.ajaxWatchlistSpinner = false;
                    if (response != null) {
                        $rootScope.watchlistList = response;
                        $rootScope.tvShowList = _(response.tvShow).toArray();
                        $rootScope.movieList = response.movie;
                        var tvListLength = $rootScope.tvShowList ? $rootScope.tvShowList.length : 0;
                        var movieListLength = $rootScope.movieList ? $rootScope.movieList.length : 0;
                        analyticsService.TrackWatchList(tvListLength + movieListLength);
                        //WatchListService.ExecutBGCalls(); //execute BG calls to fetch actual image
                    }
                });
            }
        }; //end of menu selection click
        //zip code validation 
        $scope.regex = /\d{5}-\d{4}$|^\d{5}$/;
        $scope.validateZipCodeBasedOnCountry = function(country) {
            for (var i = 0; i < $rootScope.countryList.length; i++) {
                if (country == $rootScope.countryList[i].code) {
                    if (typeof $rootScope.countryList[i].zip_regular_expression != 'undefined') {
                        var regexObj = new RegExp($rootScope.countryList[i].zip_regular_expression);
                        $scope.regex = regexObj;
                    }
                }
            }
            return $scope.regex;
        };
        //resume playback --------------------------------------
        $scope.setResumePlayheadPosition = function(url, id, playhead) {
            url = '/' + url;
            $scope.close();
            $rootScope.openPlayheadResumeDialog(url, id, playhead);
        };
        //////////////////////////////WATCHLIST/////////////////////////////////////////////
        $scope.displayTvshowList = $scope.displayMovieList = true;
        $scope.isPlaylistCheckboxFilterChange = function(checkboxfilterValue, selectfilterValue) {
            parseWatchlistFilter(checkboxfilterValue, selectfilterValue);
        };
        $scope.isPlaylistSelectFilterChange = function(checkboxfilterValue, index) {
            $scope.selectedFilterValue = $scope.watchlistFilterCombo[index];
            parseWatchlistFilter(checkboxfilterValue, $scope.selectedFilterValue.value);
        };
        var parseWatchlistFilter = function(checkboxValue, selectboxValue) {
            if (selectboxValue == 'all') {
                $scope.displayTvshowList = $scope.displayMovieList = true;
            } else if (selectboxValue == 'tvShow') {
                $scope.displayTvshowList = true;
                $scope.displayMovieList = false;
            } else if (selectboxValue == 'movie') {
                $scope.displayTvshowList = false;
                $scope.displayMovieList = true;
            }
        };
        //////////////////////////////WATCHLIST////////////////////////////////////////
        /**
         * Season list page
         **/
        $scope.seasonListPage = function(templUrl, seasonDetails, seasonIndex) {
            $scope.ajaxSeasonSpinner = true;
            $scope.seasonIndex = seasonIndex;
            $rootScope.templateName = templUrl;
            jQuery('.st-vertical-menu-container').hide();
            $rootScope.subContentStyle = {
                "width": "100%"
            };
            $scope.seasonDetails = seasonDetails;
            if (seasonDetails.showtype == 'Episode') {
                $scope.ajaxSeasonSpinner = false;
                $rootScope.seasonList = seasonDetails.episode;
            } else if ((seasonDetails.showtype == 'Season') || (seasonDetails.showtype == 'Series')) {
                var seriesData = {
                    seriesId: seasonDetails.seriesId,
                    episodeIdsList: seasonDetails.episodeIdsList,
                    seasonNumbersList: seasonDetails.seasonNumbersList
                };
                WatchListService.GetEpisodeListBySeasonId(seriesData).then(function(seasonResponse) {
                    if (seasonDetails.episode) {
                        angular.forEach(seasonDetails.episode, function(value, key) {
                            if (seasonDetails.seasonNumbersList.indexOf(key) > -1) {} else {
                                seasonResponse[key] = value;
                            }
                        });
                    }
                    $scope.ajaxSeasonSpinner = false;
                    $rootScope.seasonList = seasonResponse;
                });
            }
        };
        /**
         *
         * To close the admin slide navigation.
         */
        $scope.close = function() {
            slidenav.close();
        };
        /**
         *
         * To switch the template on clicking the side navigation of admin slider.
         *
         */
        $scope.changeTemplate = function(templateName) {
            $rootScope.templateName = templateName;
        };
        $scope.ChangeLanguage = function(lang) {
            $translate.use(lang);
            $rootScope.CurrentLang = lang;
        };
        /**
         * Admin side menus
         */
        $rootScope.$watch("appGridMetadata", function(newValue, oldValue) {
            if (newValue != '') {
                if (typeof $rootScope.appGridMetadata['useradmin'] !== 'undefined') {
                    var menu_list = parseAppgridData($rootScope.appGridMetadata['useradmin']); //(JSON.parse($rootScope.appGridMetadata['useradmin']));
                    $rootScope.asideMenu = menu_list;
                    var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                    var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                    var dimension = device['webDesktop']['search'];
                    $scope.newbase = imgbase + '/' + dimension + '/';
                }
            }
        });
        //Watchlist tpl
        $scope.getElapsedPercentage = function(index) {
            if ($rootScope.continueWatchingList != null) {
                var playhead = $rootScope.continueWatchingList[index].xdrContent.playhead_seconds / 60;
                var duration = ($rootScope.continueWatchingList[index].duration);
                return playhead / duration * 100 + '%';
            }
        };
        $scope.remove = function(index, list) {
            list.splice(index, 1)[0];
        };
        /////////////////////////////WATCHLIST DELETE STARTS//////////////////////////////////
        $scope.removeWatchList = function(index, id, list) {
            $rootScope.openDeleteWatchlistDialog(index, id, list);
        };
        $scope.removeAllWatchListItems = function() {
                $rootScope.openDeleteAllWatchlistDialog();
            }
            /////////////////////////////WATCHLIST DELETE STOPS///////////////////////////////////
            //////////////////////////////////SEASON PAGE/////////////////////////////////////////
        $scope.adminWatchListPlayAll = function() {
            $scope.ajaxWatchlistSpinner = true;
            WatchListService.playAll().then(function(response) {
                $scope.ajaxWatchlistSpinner = false;
                if (response[response.length - 1].nextIndex != null) {
                    response[response.length - 1].nextIndex = null;
                }
                $rootScope.playListStack = response;
                if (typeof $rootScope.playListStack !== 'undefined' && $rootScope.playListStack !== '' && $rootScope.playListStack.length > 0) {
                    $scope.ajaxWatchlistSpinner = false;
                    var firstItem = $rootScope.playListStack[0];
                    $scope.close();
                    $location.search('titleId', firstItem.id);
                    $location.search('isPlayAll', 'true');
                    $location.search('next', firstItem.nextIndex);
                    $location.path("/" + firstItem.source);
                }
            });
        }
        $scope.adminseasonPlayAll = function() {
            $scope.ajaxSeasonSpinner = true;
            if ($rootScope.seasonList) {
                var episodeList = [];
                var nextIndex = 1;
                angular.forEach($rootScope.seasonList, function(seasons) {
                    angular.forEach(seasons, function(episodes) {
                        episodes['nextIndex'] = nextIndex;
                        episodes['source'] = 'tvShow';
                        episodeList.push(episodes);
                        nextIndex++;
                    });
                });
                if (episodeList[episodeList.length - 1].nextIndex != null) {
                    episodeList[episodeList.length - 1].nextIndex = null;
                }
                $rootScope.playListStack = episodeList;
                if (typeof $rootScope.playListStack !== 'undefined' && $rootScope.playListStack !== '' && $rootScope.playListStack.length > 0) {
                    $scope.ajaxSeasonSpinner = false;
                    var firstItem = $rootScope.playListStack[0];
                    $scope.close();
                    $location.search('titleId', firstItem.id);
                    $location.search('isPlayAll', 'true');
                    $location.search('next', firstItem.nextIndex);
                    $location.path("/" + firstItem.source);
                }
            }
        }
        $scope.removeSeasonList = function(seasonIdsList, episodeIdsList, seasonIndex) {
            seasonIdsList = (typeof seasonIdsList != 'undefined') ? seasonIdsList : new Array();
            episodeIdsList = (typeof episodeIdsList != 'undefined') ? episodeIdsList : new Array();
            var fullIdList = arrayUnique(seasonIdsList.concat(episodeIdsList));
            $rootScope.openDeleteAllSeasonlistDialog(fullIdList, seasonIndex);
        };
        $rootScope.openDeleteAllSeasonlistDialog = function(fullIdList, seasonIndex) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoWatchlistDeleteAllBoxDialog.html',
                controller: SeasonListDeleteModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    fullIdList: fullIdList,
                    seasonIndex: seasonIndex
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        ////////////////////////////////////SEASON PAGE////////////////////////////////
        /////////////////////////////CONTINUE WATCHING DELETE STARTS////////////////////////
        $scope.removeContinueWatching = function(index, embedCode, list) {
            $scope.openDeleteContinueWatchingDialog(index, embedCode, list);
        };
        $scope.openDeleteContinueWatchingDialog = function(index, embedCode, list) {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoXDRItemDeleteBoxDialog.html',
                controller: WatchListDeleteModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return ({
                    index: index,
                    embedCode: embedCode,
                    list: list
                }); // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        $scope.removeAllContinueWatching = function() {
            $scope.openDeleteAllContinueWatchingDialog();
        }
        $scope.openDeleteAllContinueWatchingDialog = function() {
            $scope.opts = {
                dialogFade: false,
                keyboard: true,
                templateUrl: '/views/dialog/infoXDRDeleteAllBoxDialog.html',
                controller: WatchListDeleteModalInstanceCtrl,
                backdrop: 'static', //to make the backdrop static
                resolve: {} // empty storage
            };
            $scope.opts.resolve.items = function() {
                return; // pass name to Dialog
            };
            var modalInstance = $modal.open($scope.opts);
        };
        /////////////////////////////CONTINUE WATCHING DELETE STOPS/////////////////////////
        $scope.removeAllReminders = function() {
            delete $scope.reminderList;
        };
        $scope.helpCenter = function() {};
        $scope.removeAllSeries = function() {
            delete $scope.watchlistSeriesList;
        };
        $scope.removeExpired = function() {
            for (var i = 0; i < $scope.reminderList.length; i++) {
                if ($scope.reminderList[i].type == 2) {}
            };
        };
        $scope.removeAllWatchlist = function() {
            WatchListService.DeleteItem(0, "all").then(function(response) {
                if (response.data.success == true) $rootScope.watchlistList = null;
            });
        };
        $scope.showWatchlistDetails = function(templUrl, index) {
            var selecteditem = $rootScope.watchlistList[index];
            if (selecteditem.type === 'tv') {
                $rootScope.templateName = templUrl;
                jQuery('.st-vertical-menu-container').hide();
                $rootScope.subContentStyle = {
                    "width": "100%"
                };
                $scope.selectedWatchlistSeries = selecteditem;
            }
        };
        $rootScope.backToMenu = function(templUrl) {
            $rootScope.seasonList = null;
            $rootScope.templateName = templUrl;
            jQuery('.st-vertical-menu-container').show();
            $rootScope.subContentStyle = {
                "width": ""
            };
        };
        $rootScope.backToMenu = function(templUrl) {
            $rootScope.templateName = templUrl;
            jQuery('.st-vertical-menu-container').show();
            $rootScope.subContentStyle = {
                "width": ""
            };
        };
    }
]);
var SeasonListDeleteModalInstanceCtrl = ['$scope', '$modalInstance', 'items', 'WatchListService', 'XDRService', '$rootScope', 'Sessions', 'analyticsService', function($scope, $modalInstance, items, WatchListService, XDRService, $rootScope, Sessions, analyticsService) {
    $scope.cancel = $scope.confirm = true;
    $scope.checkMark = $scope.existConfirm = $scope.ajaxWatchlistInfoSpinner = false;
    $scope.message_1 = true;
    $scope.message_2 = $scope.message_3 = $scope.tickMark = $scope.crossMark = false;
    $scope.confirmWatchlistDeleteAllDeleteAction = function() {
        $scope.successflag = false;
        $scope.ajaxWatchlistInfoSpinner = true;
        if (typeof items.fullIdList != 'undefined' && items.fullIdList.length > 0) {
            var count = items.fullIdList.length - 1;
            angular.forEach(items.fullIdList, function(value, key) {
                if (typeof value != 'undefined') {
                    WatchListService.DeleteItem(value, "item").then(function(response) {
                        $scope.cancel = $scope.confirm = $scope.ajaxWatchlistInfoSpinner = false;
                        $scope.existConfirm = true;
                        if (response) {
                            if (response.success == true) {
                                $scope.message_2 = $scope.tickMark = true;
                                $scope.message_1 = $scope.message_3 = false;
                                var index = $rootScope.globalWatchlistIds.indexOf(value);
                                if (index > -1) {
                                    $rootScope.globalWatchlistIds.splice(index, 1);
                                }
                            } else {
                                $scope.message_1 = $scope.message_2 = false;
                                $scope.message_3 = $scope.tickMark = true;
                            }
                        } else {
                            $scope.message_1 = $scope.message_2 = false;
                            $scope.message_3 = $scope.crossMark = true;
                        }
                    });
                }
                if (key == count) {
                    delete $rootScope.seasonList;
                    if (typeof $rootScope.tvShowList != 'undefined' && items.seasonIndex != null) $rootScope.tvShowList.splice(items.seasonIndex, 1)[0];
                    $rootScope.backToMenu('views/admin/watchlist.html');
                }
            });
        }
    };
    $scope.cancelAction = function() {
        $modalInstance.dismiss('cancel');
    };
}];

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }
    return a;
};