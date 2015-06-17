/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
mdlDirectTvApp.controller('TVSingleAssetCtrl', ['analyticsService', '$scope', 'railService', 'SingleAssetService', 'PlayerService', 'contentService', '$http', '$routeParams', '$rootScope', 'SocialService', '$location', 'configuration', 'WatchListService', 'Sessions', '$translate', '$filter', '$window',
    function(analyticsService, $scope, railService, SingleAssetService, PlayerService, contentService, $http, $routeParams, $rootScope, SocialService, $location, configuration, WatchListService, Sessions, $translate, $filter, $window) {
        /*Initialization*/
        $scope.init = function() {
            Sessions.GetUserData();
            $rootScope.setNextWidgetData(null);
            $scope.ajaxTVloader = true;
            $scope.currentUrl = configuration.server_url + '/tvShow?titleId=' + $routeParams.titleId;
            $scope.noPreview = true;
            $scope.showBanner = false;
            $scope.isTrailer = (typeof $routeParams.isTrailer !== 'undefined' && $routeParams.isTrailer === 'true') ? true : false;
            $scope.socialShareUrl = configuration.server_url + "/social?titleId=" + $routeParams.titleId + "&lang=" + $rootScope.CurrentLang;
            $scope.pagename = 'tv';
            $scope.initalLoad = true;
            $rootScope.showWatchlistAddBtn = true;
            $rootScope.showWatchlistRemoveBtn = false;
            $scope.showGrid = false;
            /*Resume play back using play head position*/
            $scope.playhead_seconds = (typeof $routeParams.playhead_seconds === 'undefined' || $routeParams.playhead_seconds === '') ? 0 : $routeParams.playhead_seconds;
            $scope.initialSeasonObj = {
                label: 'TEXT_FILTER_ALL_SEASONS',
                season_number: 'All',
                added_to_watchlist: false,
                number: ''
            };
        };
        /*Call Initialization Method*/
        $scope.init();
        /*Signup button action if not logged in*/
        $scope.signup = function() {
            $rootScope.signupModal(1);
        };
        $scope.analyticPagename = "";
        /*Method to populate metadata*/
        $scope.populateMetadata = function(isContinuousPlayBack, titleIdOrEmbedCode) {
            SingleAssetService.getMetadata(isContinuousPlayBack, titleIdOrEmbedCode).then(function(response) {
                $scope.ajaxTVloader = false;
                if (typeof response === 'undefined' || !angular.isObject(response)) {
                    return null;
                }
                $scope.assetData = response;
                if (typeof $scope.assetData != "undefined" && typeof $scope.assetData.studio_display != "undefined") {
                    var studio_en = (typeof $scope.assetData.studio_display['en_US'] != 'undefined') ? $scope.assetData.studio_display['en_US'] : '';
                    var studio_es = (typeof $scope.assetData.studio_display['es_ES'] != 'undefined') ? $scope.assetData.studio_display['es_ES'] : '';
                    $scope.assetData.programer_studioname = contentService.getContentProviderName($scope.assetData.content_provider, studio_en, studio_es);
                } else {
                    $scope.assetData.programer_studioname = "";
                }
                if (typeof $scope.assetData.titleId != 'undefined') {
                    $scope.currentAssetTitleId = $scope.assetData.titleId;
                } else {
                    $scope.currentAssetTitleId = '';
                }
                $scope.setGenerQuery(response.genres);
                $scope.embCode = (typeof response.embed_code !== 'undefined') ? response.embed_code : null;
                $scope.preview_embedCode = (typeof response.preview_embedcode !== 'undefined') ? response.preview_embedcode : null;
                if ($scope.preview_embedCode != null) {
                    $scope.noPreview = false;
                    if ($scope.isTrailer) {
                        $scope.embCode = $scope.preview_embedCode;
                    }
                }
                if ($scope.assetData.isExistInPlayList) {
                    $rootScope.showWatchlistRemoveBtn = true;
                    $rootScope.showWatchlistAddBtn = false;
                } else {
                    $rootScope.showWatchlistRemoveBtn = false;
                    $rootScope.showWatchlistAddBtn = true;
                }
                $scope.movie_titleORshowname_Seasonid_Episodeid = '';
                if (typeof $scope.assetData[$rootScope.CurrentLang] !== 'undefined') {
                    $scope.movie_titleORshowname_Seasonid_Episodeid = (typeof $scope.assetData[$rootScope.CurrentLang]['title_long'] !== 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['title_long'] : '';
                    $scope.programTitleMedium = (typeof $scope.assetData[$rootScope.CurrentLang]['title_medium'] != 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['title_medium'] : '';
                    $scope.programSummaryMedium = (typeof $scope.assetData[$rootScope.CurrentLang]['summary_medium'] != 'undefined') ? $scope.assetData[$rootScope.CurrentLang]['summary_medium'] : '';
                }
                /*Analytics*/
                var genres = (typeof $scope.assetData.genres !== 'undefined') ? $scope.assetData.genres : "";
                $scope.propNine = $scope.pagename + ":index";
                $scope.analyticPagename = $scope.pagename + ":index:" + genres + ':' + $scope.movie_titleORshowname_Seasonid_Episodeid;
                //---------------- 
                $scope.videoOrlive = "video"; //used for evar11 (live or video) omniture analytics
                /*Check if the showtype is episode*/
                if ($scope.assetData.show_type === 'Episode' || $scope.isTrailer) {
                    if (!isContinuousPlayBack) {
                        $scope.choosePlayer();
                    }
                    /*Load Similar rails based on embed code*/
                    railService.reloadSingleRailorGridUsingFirstMatchingQuery('similar', $scope.VisiblerailList, $scope.type, $scope.embCode, null);
                } else if ($scope.assetData.show_type === 'Series') { //if showtype is series show banner image */
                    $scope.bannerImageBlurProcess();
                    $scope.showBanner = true;
                }
                /*Load rails based on genres*/
                railService.reloadSingleRailorGridUsingFirstMatchingQuery('similar_genre', $scope.VisiblerailList, $scope.type, null, $scope.genreQuery);
                /*SOCIAL SHARE BUTTON*/
                console.log('tv show assests');
                console.log($scope.assetData);
                // SocialService.getShareButtons($scope.socialShareUrl, $scope.programTitleMedium, $scope.programSummaryMedium, "SAP", "dummy/icon/facebook2.png", "dummy/icon/twitter.png", $scope.assetData['thumbnail'], $rootScope.enableTwitterSharing, $rootScope.enableFacebookSharing);              
                console.log($scope.socialShareUrl);
                analyticsService.TrackCustomPageLoad($scope.analyticPagename, $scope.propNine);
                analyticsService.TrackProgramDetailsPageLoad($scope.analyticPagename, $scope.movie_titleORshowname_Seasonid_Episodeid, $scope.currentAssetTitleId, $scope.propNine, $scope.videoOrlive, $scope.assetData.show_type, $scope.assetData.content_provider, $scope.assetData.genres);
            }).then($scope.seasonsAndEpisodes);
        };
        $rootScope.CurrentPagename = "tv";
        $rootScope.$watch("CurrentLang", function(newValue, oldValue) {
            railService.reloadSingleRailorGridUsingFirstMatchingQuery('live', $scope.VisiblerailList, null, null, null);
        });
        /*Select Player*/
        $scope.choosePlayer = function() {
            var PLAYER_NAMESPACE = MPLAYER_3;
            var playerWraper = "tv_playerwrapper";
            if (($routeParams.isPlayAll === true || $routeParams.isPlayAll === "true") && typeof $rootScope.playListStack !== 'undefined' && $rootScope.playListStack !== '') {
                PLAYER_NAMESPACE = MPLAYER_3;
            } else if ($scope.isTrailer) {
                PLAYER_NAMESPACE = MPLAYER_4;
            }
            console.log("inside choosePlayer function")
            console.log($scope.analyticPagename);
            PlayerService.mainPlayer(PLAYER_NAMESPACE, playerWraper, $scope);
        };
        $rootScope.loadNextEpisode = function(embCode, titleId) {
            console.log('Loading next episode');
            $rootScope.playVideo({
                'embed_code': embCode,
                'titleId': titleId
            }, $scope);
        };
        $scope.loadMore = function() {
            if (typeof $scope.VisiblerailList != 'undefined' && $scope.disableInfiniteScroll == false) {
                $scope.LoadMoreRailItem($scope.VisiblerailList.length, $rootScope.RailOnScrollItemCount);
                console.log("LoadMoreEvent fired");
                console.log($scope.VisiblerailList);
            }
        };
        $scope.disableInfiniteScroll = false;
        /*Give Blur effect to Background of Banner image*/
        $scope.bannerImageBlurProcess = function() {
            if ($scope.assetData.masthead.indexOf('dummy/blank_image.png') !== -1) {
                $scope.assetData.masthead = ((typeof $rootScope.appgridAssets['placeholder-yaveo-large-16-9'] != 'undefined') ? ($rootScope.appgridAssets['placeholder-yaveo-large-16-9']).replace("https", "http") : '/dummy/blank_image.png');
            }
            $scope.actualSeriesBanner = $scope.imageMetaDetails.imageshackBaseurl + '/' + $scope.imageMetaDetails.deviceArr.webDesktop.showcase + '/' + $scope.assetData.masthead;
            console.log($scope.actualSeriesBanner);
            $scope.$watch("imageMetaDetails", function(newval, oldval) {
                if (typeof newval !== 'undefined') {
                    var svgCont = jQuery("#svgcont"); //document.getElementById('svgcont');
                    var contHtml = '<svg id="svg-image-blur">';
                    contHtml += '<image width="100%" height="300%" x="0" y="-300px" id="svg-image" xlink:href="' + $scope.imageMetaDetails.imageshackBaseurl + '/' + $scope.imageMetaDetails.deviceArr.webDesktop.showcase + '/' + $scope.assetData.masthead + '" />';
                    contHtml += '<filter id="blur-effect-1"><feGaussianBlur stdDeviation="10" /></filter></svg>';
                    svgCont.html(contHtml);
                }
            });
        };
        /*Episode Listing*/
        $scope.seasonsAndEpisodes = function() {
            if (typeof $scope.assetData.series_id === 'undefined') {
                return null;
            }
            var season_id;
            if ($scope.assetData.show_type === 'Episode') {
                season_id = $scope.assetData.season_id;
            } else {
                season_id = 'default';
            }
            SingleAssetService.getEpisodeListOfaSeason($scope.assetData.series_id, season_id).then(function(response) {
                $scope.seasonList = (typeof response.episodes !== 'undefined') ? response.seasons : '';
                var episodesResponse = (typeof response.episodes !== 'undefined') ? response.episodes : '';
                $scope.allEpisodes = $scope.episodes = $scope.processEpisodes(episodesResponse);
                /*For continuous play back- order the episode by seadon id and Episode id*/
                $scope.titleEmbedCodeArr = $scope.sortData($scope.allEpisodes, ["season_id", "episode_id"]);
                /*Season list */
                $scope.createSeasons();
                if (typeof response.episodes[0] != 'undefined' && typeof response.episodes[0].season_id != 'undefined') {
                    $scope.selectedSeason = $scope.getSeasonObjFromSeasonId(response.episodes[0].season_id);
                }
                /* BG call to check if item is already in watchlist */
                if (typeof $scope.episodes != 'undefined' && typeof $scope.episodes.length != 'undefined' && $scope.episodes.length > 0) {
                    $scope.UpdateEpisodeList_AddorRemovePlayListButton();
                }
                /*Load Similar rails based on embed code of last episode of last season on Series page*/
                if (typeof $scope.assetData != 'undefined' && $scope.assetData.show_type === 'Series') {
                    $scope.embCode = (typeof $scope.allEpisodes[0] != 'undefined') ? $scope.allEpisodes[0].embed_code : '';
                    railService.reloadSingleRailorGridUsingFirstMatchingQuery('similar', $scope.VisiblerailList, $scope.type, $scope.embCode, null);
                }
            });
        };

        function FindAnEpisodeWithSeasonId(season_id) {
                console.log(season_id);
                console.log("--FindAnEpisodeWithSeasonId--");
                console.log($scope.allEpisodes);
                var CurObjList = $filter('filter')($scope.allEpisodes, {
                    season_id: season_id
                });
                console.log(CurObjList);
                return ((typeof CurObjList[0] !== 'undefined') ? 'found' : 'notfound');
            }
            /*Update Episode Listing*/
        $scope.UpdateseasonsAndEpisodes = function(season_id) {
            if (typeof $scope.assetData.series_id === 'undefined') {
                return null;
            }
            if (FindAnEpisodeWithSeasonId(season_id) == 'notfound') {
                SingleAssetService.getEpisodeListOnlyOfaSeason($scope.assetData.series_id, season_id).then(function(response) {
                    var episodesResponse = (typeof response.episodes !== 'undefined') ? response.episodes : '';
                    //$scope.allEpisodes.push($scope.processEpisodes(episodesResponse));
                    var newepisodesArr = $scope.processEpisodes(episodesResponse);
                    for (var g = 0; g < newepisodesArr.length; g++) {
                        $scope.allEpisodes.push(newepisodesArr[g]);
                    }
                    $scope.episodes = $scope.allEpisodes;
                    console.log("before reset in promise");
                    console.log($scope.allEpisodes);
                    /*For continuous play back- order the episode by seadon id and Episode id*/
                    $scope.titleEmbedCodeArr = $scope.sortData($scope.allEpisodes, ["season_id", "episode_id"]);
                    if (typeof response.episodes[0] != 'undefined' && typeof response.episodes[0].season_id != 'undefined') {
                        $scope.resetSeason($scope.getSeasonObjFromSeasonId(response.episodes[0].season_id));
                    }
                    /* BG call to check if item is already in watchlist */
                    if (typeof $scope.episodes != 'undefined' && typeof $scope.episodes.length != 'undefined' && $scope.episodes.length > 0) {
                        $scope.UpdateEpisodeList_AddorRemovePlayListButton();
                    }
                    console.log("after reset in promise");
                    console.log($scope.allEpisodes);
                });
            }
        };
        $scope.getSeasonObjFromSeasonId = function(season_id) {
                for (var i = 0; i < $scope.seasons.length; i++) {
                    if ($scope.seasons[i].number == season_id) return $scope.seasons[i];
                }
                return null;
            }
            /*Process Episodes by adding images/ place holders*/
        $scope.processEpisodes = function(episodes) {
            if (episodes === '') {
                var episodeslist = [];
                return episodeslist;
            }
            for (var i in episodes) {
                var newImgPath = '';
                if (episodes[i].thumbnail.indexOf('dummy/blank_image.png') === -1) {
                    newImgPath = $scope.newbase + episodes[i].thumbnail;
                } else {
                    newImgPath = $scope.newbase + ((typeof $rootScope.appgridAssets['placeholder-large-16-9'] != 'undefined') ? $rootScope.appgridAssets['placeholder-large-16-9'] : '/dummy/blank_image.png');
                }
                episodes[i].image = newImgPath;
            }
            return episodes;
        };
        /*Season list*/
        $scope.createSeasons = function() {
            $scope.seasons = [];
            if (typeof $scope.seasonList === 'undefined' || $scope.seasonList.length == 0) {
                return null;
            }
            $scope.SeasonCount = (typeof $scope.seasonList.length !== 'undefined') ? $scope.seasonList.length : false;
            /*Push All season item to the list */
            //$scope.seasons.push($scope.initialSeasonObj);
            for (var i = 0; i < $scope.seasonList.length; i++) {
                $scope.seasons.push({
                    season_number: $scope.seasonList[i].season_id,
                    label: 'TEXT_FILTER_SEASON',
                    number: $scope.seasonList[i].season_id,
                    added_to_watchlist: false,
                    id: $scope.seasonList[i].season_title_id,
                    isShow: false
                });
            }
        };
        /* Function to update UI when a season is selected from drop-down*/
        $scope.SeasonSelected = function(season) {
            $scope.UpdateseasonsAndEpisodes(season.season_number);
            if (season.season_number != "All") {
                $scope.resetSeason(season);
                console.log('not all');
            } else {
                $scope.selectedSeason = season;
                $scope.episodes = $scope.allEpisodes;
            }
        };
        $scope.resetSeason = function(season) {
            $scope.selectedSeason = season;
            console.log('>>seasonid in resetSeason');
            console.log(season);
            console.log(season.season_number);
            $scope.episodes = [];
            for (var i = 0; i < $scope.allEpisodes.length; i++) {
                if ($scope.allEpisodes[i].season_id == season.season_number) {
                    $scope.episodes.push($scope.allEpisodes[i]);
                }
            }
            if (!isMobile.any() && $rootScope.isLoggedIn) {
                $scope.ajaxSeasonSpinner = true;
                $scope.selectedSeason.isShow = false;
                WatchListService.CheckItemExists(season.id).then(function(data) {
                    $scope.ajaxSeasonSpinner = false;
                    $scope.selectedSeason.added_to_watchlist = data.isExist;
                    $scope.selectedSeason.isShow = true;
                });
            }
            console.log('Updated Episodes Array:---');
            console.log($scope.episodes);
        };
        /*Function to calculate the elapsed time and update the progress bar */
        $scope.getElapsedPercentage = function(index) {
            var playhead = $scope.episodes[index].playhead_seconds;
            var duration = $scope.episodes[index].duration;
            var progress = (playhead / duration) * 100;
            return progress + '%';
        };
        /*Sort Data by criteria*/
        $scope.sortData = function(ArrayToSort, criteria) {
            var newdata = $filter('orderBy')(ArrayToSort, criteria);
            return newdata;
        };
        $scope.setResumePlayheadPosition = function(titleid, playhead) {
            var url = '/tvShow';
            if (playhead == 0) {
                $location.path(url).search({
                    'titleId': titleid
                });
            } else {
                $rootScope.openPlayheadResumeDialog(url, titleid, playhead);
            }
        };
        $scope.UpdateEpisodeList_AddorRemovePlayListButton = function() {
            for (var i = 0; i < $scope.episodes.length; i++) {
                var isIdExistInGlobalWatchlist = $rootScope.checkTitleExistInGlobalWatchlistIds($scope.episodes[i].titleId);
                if (isIdExistInGlobalWatchlist == true) {
                    $scope.episodes[i].added_to_watchlist = false;
                    $scope.episodes[i].removed_to_watchlist = true;
                } else if (isIdExistInGlobalWatchlist == false) {
                    $scope.episodes[i].added_to_watchlist = true;
                    $scope.episodes[i].removed_to_watchlist = false;
                } else {
                    $scope.episodes[i].added_to_watchlist = false;
                    $scope.episodes[i].removed_to_watchlist = false;
                }
            }
        };
        $scope.AddRelatedEpisodeToWatchList = function(episodeID) {
            $rootScope.WatchListAddition_InProgress = true;
            $scope.Watchlist_type = 'EPISODE';
            $scope.selected_episodeID = episodeID;
            $rootScope.addWatchList(episodeID, 'SAP');
        };
        $scope.DeleteRelatedEpisodeToWatchList = function(episodeID) {
            $rootScope.openDeleteWatchlistDialog(null, episodeID, null);
        };
        $scope.AddEntireSeasonWatchList = function() {
            if ($scope.selectedSeason.season_number != 'All' && typeof $scope.selectedSeason.season_number != 'undefined') {
                $rootScope.WatchListAddition_InProgress = true;
                $scope.Watchlist_type = 'SEASON';
                $rootScope.addWatchList($scope.selectedSeason.id, 'SAP');
            }
        };
        $scope.removeEntireSeasonWatchList = function() {
            if ($scope.selectedSeason.season_number != 'All' && typeof $scope.selectedSeason.season_number != 'undefined') {
                $rootScope.WatchListAddition_InProgress = true;
                $scope.Watchlist_type = 'SEASON';
                //$rootScope.addWatchList($scope.selectedSeason.id, 'SAP');
                $rootScope.openDeleteWatchlistDialog(null, $scope.selectedSeason.id, null);
            }
        };
        /*Watch playlist items and update the UI add or remove buttons */
        $rootScope.$watch("globalWatchlistIds", function(newval, oldval) {
            if (typeof newval != 'undefined' && typeof $scope.episodes != 'undefined') {
                $scope.UpdateEpisodeList_AddorRemovePlayListButton();
            }
            if (typeof newval != 'undefined') {
                var isIdExistInGlobalWatchlist = $rootScope.checkTitleIDExistInGlobalWatchlistIds($scope.currentAssetTitleId);
                if (isIdExistInGlobalWatchlist) {
                    $rootScope.showWatchlistAddBtn = false;
                    $rootScope.showWatchlistRemoveBtn = true;
                } else {
                    $rootScope.showWatchlistAddBtn = true;
                    $rootScope.showWatchlistRemoveBtn = false;
                }
            }
            if (typeof $scope.selectedSeason != 'undefined' && typeof $scope.selectedSeason.id != 'undefined') {
                WatchListService.CheckItemExists($scope.selectedSeason.id).then(function(data) {
                    $scope.selectedSeason.added_to_watchlist = data.isExist;
                    $scope.selectedSeason.isShow = true;
                });
            }
        }, true);
        /* This will be executed when variable appGridMetadata is changed */
        $rootScope.$watch('[appGridMetadata,appgridAssets]', function(newValue, oldValue) {
            if (newValue[0] != '') {
                $scope.imageMetaDetails = { //(JSON.parse($rootScope.appGridMetadata.gateways))['images'],
                    //JSON.parse($rootScope.appGridMetadata.device)
                    "imageshackBaseurl": parseAppgridData($rootScope.appGridMetadata.gateways).images,
                    "deviceArr": parseAppgridData($rootScope.appGridMetadata.device)
                };
                var imgbase = parseAppgridData($rootScope.appGridMetadata['gateways']).images; //(JSON.parse($rootScope.appGridMetadata['gateways'])).images;
                var device = parseAppgridData($rootScope.appGridMetadata['device']); //(JSON.parse($rootScope.appGridMetadata['device']));
                var dimension = device['webDesktop']['rail.standard'];
                $scope.newbase = imgbase + '/' + dimension + '/';
                $scope.railList = [];
                $scope.pageDetails = $rootScope.getPageDetails($scope.pagename);
                if (typeof $scope.pageDetails !== 'undefined' && $scope.pageDetails !== null) {
                    if (typeof $scope.pageDetails['items'] !== 'undefined') {
                        $scope.railList = $scope.pageDetails['items'];
                        console.log('Complete items obj');
                        console.log($scope.railList);
                        $scope.VisiblerailList = [];
                        $scope.LoadMoreRailItem(0, $rootScope.RailInitialLoadItemCount);
                    }
                }
            }
            if (newValue[1] != '') {
                var appAssets = $rootScope.appgridAssets;
                console.log(appAssets.third_party_cookie);
                var tpcUrl = appAssets.third_party_cookie;
                //$scope.checkThirdPartyEnabled();
                if ($rootScope.isLoggedIn) {
                    $scope.checkThirdPartyEnabled(tpcUrl);
                } else {
                    $scope.populateMetadata(false, $routeParams.titleId);
                }
            }
        }, true);
        //<iframe id="cookieUrl" src="https://b091462921713d3c55184ced1914d5f611df3934-www.googledrive.com/host/0B4IGm0TG9QPAWURxVmZwNEJsSG8" style="display: none;"></iframe>
        //        
        //          $rootScope.$watch(
        //            "appgridAssets",
        //            function (newValue){
        //           if (newValue != '') {
        //           }
        //});
        $scope.checkThirdPartyEnabled = function(tpcUrl) {
            var iframe = document.getElementById("cookieUrl");
            iframe.onload = function() {
                iframe.contentWindow.postMessage('hello child, this is parent', '*');
                $scope.populateMetadata(false, $routeParams.titleId);
            };
            var appAssets = $rootScope.appGridMetadata;
            console.log(appAssets);
            iframe.src = tpcUrl;
            // iframe.src = "https://b091462921713d3c55184ced1914d5f611df3934-www.googledrive.com/host/0B4IGm0TG9QPAWURxVmZwNEJsSG8?configUrl="+configuration.server_url; 
        };
        /* begining of ngRepeatFinished */
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //-----------rails common code--------------------
            var assetType = ["tv_season", "tv_series", "tv_episode", "tv_show"];
            var tvTypes = {};
            tvTypes.types = assetType;
            var type = JSON.stringify(tvTypes);
            $scope.type = type;
            $rootScope.isLoggedIn = Sessions.isLoggedIn();
            var singleAssetBaseUrl = '/tvShow';
            if ($rootScope.isLoggedIn) {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, Sessions.getCookie('accessToken'), null, null, type);
            } else {
                railService.AddnewRailsorGrid(singleAssetBaseUrl, $scope.VisiblerailList, null, null, null, type);
            }
        }); /* end of ngRepeatFinished */
        /*Create and set genrequery for Similar movie rails*/
        $scope.setGenerQuery = function(geners) {
            if (typeof geners !== 'undefined' && typeof geners === 'string') {
                var generLists = geners.split(",");
                var queryObj = {};
                queryObj = {
                    genres: generLists
                };
                var res = JSON.stringify(queryObj);
                $scope.genreQuery = res;
            } else {
                $scope.genreQuery = '';
            }
        };
        //bolt rail related codes
        $scope.LoadMoreRailItem = function(curLength, noofnewAssets) {
            var TotalRailItems = $scope.railList.length;
            if ((curLength + noofnewAssets) >= TotalRailItems) {
                noofnewAssets = TotalRailItems - curLength;
                $scope.disableInfiniteScroll = true;
                console.log("disable ngscroll event true");
            }
            for (var j = (curLength != 0) ? (curLength - 1) : 0; j < (curLength + noofnewAssets); j++) {
                if (typeof $scope.railList[j] != 'undefined' && typeof $scope.VisiblerailList[j] == 'undefined') {
                    $scope.railList[j].BoltonPromoRailAssets = [];
                    if ($scope.railList[j].query == 'bolt_on_promo') { //show only to valid user
                        console.log("triggering bolt_on_promo rail");
                        $scope.VisiblerailList.push($scope.railList[j]);
                        var indeX = $scope.VisiblerailList.length - 1;
                        railService.loadBoltonPromoRailAssets($scope.railList[j], indeX).then(function(resp) {
                            console.log(" response -->");
                            console.log(resp);
                            console.log("updating bolt_on_promorail assets");
                            console.log(j + "  -->");
                            console.log(indeX);
                            console.log($scope.VisiblerailList[indeX]);
                            console.log("response thumblistCarouselOneArr  -->");
                            console.log(resp.thumblistCarouselOneArr);
                            $scope.VisiblerailList[indeX].BoltonPromoRailAssets = (typeof resp.thumblistCarouselOneArr != 'undefined' && typeof resp.thumblistCarouselOneArr[0] != 'undefined') ? resp.thumblistCarouselOneArr : [];
                            console.log("#****updated bolt_on_promorail assets");
                            console.log($scope.VisiblerailList[indeX].BoltonPromoRailAssets);
                        }, function(error) {});
                    } else if ($scope.railList[j].query == 'bolt_on_std') { //show only to valid user
                        console.log("triggering bolt_on_std rail");
                        $scope.VisiblerailList.push($scope.railList[j]);
                    } else {
                        $scope.VisiblerailList.push($scope.railList[j]);
                    }
                }
                if (typeof $rootScope.userProductList != 'undefined') {
                    console.log("calling UpdatePromoBoltonInRailScope as userProductList is not undefined");
                    UpdatePromoBoltonInRailScope();
                }
            } // end of for loop
            console.log("Updated VisiblerailList");
            console.log($scope.VisiblerailList);
        };
        $scope.boltonPromoLearnMore = function(base) {
            $location.path(base);
        };
        $scope.boltonPromoBuyNow = function(base, boltonid) {
            console.log("boltonPromoBuyNow");
            //var path1=base+"?id="+boltonid;
            console.log(base);
            $location.path(base).search({
                id: boltonid
            });
        };
        $rootScope.$watch("userProductList", function(newValue, oldValue) {
            console.log("userProductList--->>>");
            console.log(newValue);
            if (newValue == '') {
                return null;
            }
            if (typeof newValue != 'undefined') {
                console.log("*#1ProductList updated");
                UpdatePromoBoltonInRailScope();
            }
        });

        function UpdatePromoBoltonINVisibleRailList() {
            console.log("UpdatePromoBoltonINVisibleRailList function");
            for (var k in $scope.VisiblerailList) {
                console.log("bolt_on_promo_&#  check");
                console.log($scope.VisiblerailList[k].query.indexOf("bolt_on_promo_&#"));
                if ($scope.VisiblerailList[k].query.indexOf("bolt_on_promo_&#") != -1) {
                    console.log("UpdatePromoBoltonINRailList -->UpdatePromoBoltonINVisibleRailList");
                    console.log($scope.VisiblerailList[k].query);
                    if ($scope.checkPromoBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid) == true) {
                        $scope.VisiblerailList[k].query = "bolt_on_promo";
                        console.log("updating Visible Rail query name at " + k + " to " + $scope.VisiblerailList[k].query);
                        var indeX = k;
                        railService.loadBoltonPromoRailAssets($scope.railList[indeX], indeX).then(function(resp) {
                            console.log(" response -->");
                            console.log(resp);
                            console.log("updating bolt_on_promorail assets");
                            console.log(indeX);
                            console.log($scope.VisiblerailList[indeX]);
                            console.log("response thumblistCarouselOneArr  -->");
                            console.log(resp.thumblistCarouselOneArr);
                            $scope.VisiblerailList[indeX].BoltonPromoRailAssets = (typeof resp.thumblistCarouselOneArr != 'undefined' && typeof resp.thumblistCarouselOneArr[0] != 'undefined') ? resp.thumblistCarouselOneArr : [];
                            console.log("#****updated bolt_on_promorail assets");
                            console.log($scope.VisiblerailList[indeX].BoltonPromoRailAssets);
                        }, function(error) {});
                    }
                } else if ($scope.VisiblerailList[k].query.indexOf("bolt_on_std_&#") != -1) {
                    console.log("checkStdBoltoninUserBoltonList -->");
                    console.log($scope.VisiblerailList[k].query);
                    console.log("**checkStdBoltoninUserBoltonList");
                    console.log($scope.checkStdBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid));
                    if ($scope.checkStdBoltoninUserBoltonList($scope.VisiblerailList[k].boltonid) == true) {
                        $scope.VisiblerailList[k].query = "bolt_on_std";
                        $scope.$broadcast('bolt_on_stdQueryUpdate', k);
                        console.log("updating checkStdBoltoninUserBoltonList Visible Rail query name at " + k + " to " + $scope.VisiblerailList[k].query);
                    }
                }
            }
            RenewBoltonStdRailNotLoadedYetif();
        }
        $scope.$on('bolt_on_stdQueryUpdate', function(event, k) {
            console.log("$$$----> inside $on bolt_on_stdQueryUpdate");
            console.log(k);
            railService.LoadSingleRail(k, $scope.VisiblerailList[k]);
        });

        function RenewBoltonStdRailNotLoadedYetif() {
            jQuery(".owl-carousel").each(function() {
                var fid = "#" + jQuery(this).attr('ID');
                var index = typeof fid.split("_") != 'undefined' ? fid.split("_")[1] : -1;
                // jQuery(fid).prev().hide();
                if (index != -1 && typeof $scope.VisiblerailList[index] != 'undefined' && $scope.VisiblerailList[index].query == "bolt_on_std") {
                    if (typeof jQuery(fid).data('owlCarousel') == 'undefined') {
                        console.log("renewing bolt_on_std " + fid + " rails");
                        railService.LoadSingleRail(index, $scope.VisiblerailList[index]);
                    } else {
                        console.log("reShowing bolt_on_std " + fid + " rails");
                        jQuery(fid).parents(".RailngRepeatClass").removeClass("railLoading");
                        jQuery(fid).prev().show();
                        jQuery(fid).parents(".RailngRepeatClass").show();
                    }
                }
            });
        }

        function UpdatePromoBoltonInRailScope() {
            console.log("***^^***UpdatePromoBoltonInRailScope");
            UpdatePromoBoltonINVisibleRailList();
            //updateRails();
        }
        $scope.checkPromoBoltoninUserBoltonList = function(railBoltonId) {
            console.log("#*checking PromoBoltoninUserBoltonList");
            console.log($rootScope.userProductList);
            console.log(railBoltonId);
            console.log(typeof $rootScope.userProductList);
            console.log("end of #*checking PromoBoltoninUserBoltonList");
            if (typeof $rootScope.userProductList == 'undefined') {
                return null; //donot show bolton rail
            }
            var k = '{"boltons":[' + $rootScope.userProductList + ']}';
            console.log(k);
            var BoltonObj = JSON.parse(k);
            console.log(BoltonObj['boltons'].indexOf(railBoltonId));
            if (BoltonObj['boltons'].indexOf(railBoltonId) == -1) {
                return true; //show promobolton rail
            } else {
                return false; //donot show bolton rail
            }
        };
        $scope.checkStdBoltoninUserBoltonList = function(railBoltonId) {
            console.log("#*checking StdBoltoninUserBoltonList");
            console.log($rootScope.userProductList);
            console.log(railBoltonId);
            if (typeof $rootScope.userProductList == 'undefined') {
                return null; //donot show StdBolton rail
            }
            var k = '{"boltons":[' + $rootScope.userProductList + ']}';
            console.log(k);
            var BoltonObj = JSON.parse(k);
            console.log(BoltonObj['boltons'].indexOf(railBoltonId));
            console.log("end of #*checking StdBoltoninUserBoltonList");
            if (BoltonObj['boltons'].indexOf(railBoltonId) != -1) {
                return true; //show StdBolton rail
            } else {
                return false; //donot show StdBolton rail
            }
        };

        function updatePromoANDSTDBoltonRail(railobjArr) {
            var NEWrailobjArr = [];
            for (var k in railobjArr) {
                if (railobjArr[k].query == 'bolt_on_promo') {
                    if ($scope.checkPromoBoltoninUserBoltonList(railobjArr[k].boltonid) == null) {
                        //productidlist undefined so adding index of bolt_on_promo
                        console.log("Changing bolt_on_promo_ query");
                        railobjArr[k].query = "bolt_on_promo_&#" + k; //updating query
                        console.log("Changing bolt_on_promo_ query-->" + railobjArr[k].query);
                        NEWrailobjArr.push(railobjArr[k]);
                    } else {
                        $scope.checkPromoBoltoninUserBoltonList(railobjArr[k].boltonid) ? NEWrailobjArr.push(railobjArr[k]) : console.log("removing bolt_on_promorail:>" + railobjArr[k].boltonid);
                    }
                } else if (railobjArr[k].query == 'bolt_on_std') {
                    if ($scope.checkStdBoltoninUserBoltonList(railobjArr[k].boltonid) == null) {
                        //productidlist undefined so adding index of bolt_on_std
                        railobjArr[k].query = "bolt_on_std_&#" + k; //updating query
                        NEWrailobjArr.push(railobjArr[k]);
                    } else {
                        $scope.checkStdBoltoninUserBoltonList(railobjArr[k].boltonid) ? NEWrailobjArr.push(railobjArr[k]) : console.log("removing bolt_on_stdrail:>" + railobjArr[k].boltonid);
                    }
                } else {
                    NEWrailobjArr.push(railobjArr[k]);
                }
            } //end of for loop  
            return NEWrailobjArr;
        }
    }
]);