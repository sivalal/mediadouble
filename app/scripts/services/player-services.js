'use strict';
mdlDirectTvApp.service('PlayerService', ['configuration', 'analyticsService', '$rootScope', '$route', 'Sessions', 'SearchService', '$routeParams', '$http', 'WatchListService', '$location', '$filter', 'PlayerAnalyticsService', function(configuration, analyticsService, $rootScope, $route, Sessions, SearchService, $routeParams, $http, WatchListService, $location, $filter, PlayerAnalyticsService) {
    // var ooyalaMainPlayer=null;
    $rootScope.ooyalaMainPlayer = null;

    function scrolltotop() {
        jQuery(document).ready(function($) {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        });
    }
    var uat = navigator.userAgent;
    var checkert = {
        iphone: uat.match(/(iPhone|iPod|iPad)/),
        blackberry: uat.match(/BlackBerry/),
        android: uat.match(/Android/)
    };
    /**
     *
     * called on player creating event
     */
    function playerCreation() {
        console.log("player-creation");
        //scrolltotop();
    };

    function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
            if (typeof valuetosearch === 'undefined') {
                return null;
            }
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i][key] == valuetosearch) {
                    return i;
                }
            }
            return null;
        }

    var sizzlePlayerScope={};//sizzlePlayerScope variable used by onSizzlePlayBackReady function
        /**
         *
         * Sizzle Player
         */        
    this.sizzlePlayer = function(PLAYER_NAMESPACE, playerScope, sizzle) {
        var playerWraper = '';
        sizzlePlayerScope=playerScope;
        if (playerScope.embCode === null && playerScope.embCode === '') {
            return;
        }
        playerWraper = sizzle ? 'sizzle-video' : 'sizzle-video-popup';
        if(!sizzle) jQuery('#menu').hide();
        PLAYER_NAMESPACE.ready(function(PLAYER_NAMESPACE) {
            PLAYER_NAMESPACE.$("#" + playerWraper).html('');
            // if ($rootScope.ooyalaMainPlayer !== null) {
            //     $rootScope.ooyalaMainPlayer.destroy();
            // }
            if (!!$rootScope[playerWraper]) {
                $rootScope[playerWraper].destroy();
            }
            $rootScope[playerWraper] = PLAYER_NAMESPACE.Player.create(playerWraper, playerScope.embCode, {
                autoplay: true,
                wmode: 'transparent',
                width: "100%",
                height: "100%",
                loop: sizzle ? true : false,
                layout: '',
                onCreate: function(player) {
                    var vplayer = player;
                    vplayer.isSizzle = sizzle ? true : false;
                    if (!vplayer.isSizzle) { // its the popup video
                        if($rootScope['sizzle-video'] && $rootScope['sizzle-video'].pause) $rootScope['sizzle-video'].pause();
                        jQuery('#sizzle-message').hide();
                        jQuery('body').css('overflow', 'hidden');
                        jQuery('#sizzle-video-popup-overlay').show();
                    }
                    player.mb.subscribe('*', 'SizzlePlayer', function(eventName) {
                        //console.log("RECEIVED EVENT: " + eventName);
                        //console.log(arguments);
                    });

                    player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYER_CREATED, 'player-creation', PLAYER_NAMESPACE._.bind(playerCreation, this, vplayer));
                    player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYBACK_READY, 'SizzlePlayer', PLAYER_NAMESPACE._.bind(onSizzlePlayBackReady, this, vplayer));
                    player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYED, 'SizzlePlayer', PLAYER_NAMESPACE._.bind(onSizzlePlayBackEnd, this, vplayer));
                    player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAY, "SizzlePlayer player-play", function() {
                            console.log("event player-play triggered");
                            var show_type = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
                            var content_provider = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
                            var genres = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
                            analyticsService.TrackVideoPlay(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
                            if (playerScope.videoOrlive == "video") {
                                analyticsService.TrackVideoOnDemand(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
                            }
                        });
                    player.mb.publish('play');
                }
            });
        });
    };

    function onSizzlePlayBackReady() {
        var player = arguments[0];
        console.log("play ready event fired onSizzlePlayBackReady");
        //-- analytics code
        console.log("onSizzlePlayBackReady playerScope-->**");
        var playerScope=sizzlePlayerScope;
        var show_type = (typeof playerScope != 'undefined' && typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
        var content_provider = (typeof playerScope != 'undefined' && typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
        var genres = (typeof playerScope != 'undefined' && typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
        analyticsService.TrackVideoStart(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
        //-- analytics code
        if (player.isSizzle) {
            player.setVolume(0);
            $('#popUpPlayBtn').show();
        }
      //  $('#popUpPlayBtnMob').hide();
       // $("#scrollAnchor").hide();
        //trigger auto play back
        player.play();
    };

    function onSizzlePlayBackEnd() {
        var player = arguments[0];
        console.log("play ready event fired");
        jQuery('#menu').show();
        jQuery('body').css('overflow', 'scroll');
        if (!player.isSizzle) {
            player.destroy();
            $('#sizzle-video-popup-overlay').hide();
            $('#sizzle-message').show();
            $('#popUpPlayBtnMob').show();
            $("#scrollAnchor").show();
            $rootScope['sizzle-video'].play();
        }
    };
    $rootScope.closePopUpVideoPlayer = function() {
        jQuery('#menu').show();
        console.log("inside closePopUpVideoPlayer function");
        console.log($rootScope['sizzle-video-popup']);
        if ($rootScope['sizzle-video-popup'] !== null && typeof $rootScope['sizzle-video-popup'] !== 'undefined') {
            $rootScope['sizzle-video-popup'].destroy();
            console.log("inside if");
            console.log($rootScope['sizzle-video-popup']);
            jQuery('#sizzle-video-popup-overlay').hide();
            console.log(jQuery('#sizzle-video-popup-overlay').html());
            jQuery('#sizzle-message').show();
            jQuery('#popUpPlayBtnMob').show();
            jQuery("#scrollAnchor").show();
            $rootScope['sizzle-video'].play();
        }
    };
    /**
     *
     * Main Player
     */
    this.mainPlayer = function(PLAYER_NAMESPACE, playerWraper, playerScope) {
        var playerTimeChangedBelow10 = 0;
        var currentLang = Sessions.getLanguage() || 'en_US';
        //            console.log("lan");
        //            console.log(window.language);
        //
        //            console.log("lan set");
        var freewheelSettings = {
            fw_video_asset_id: playerScope.embCode,
            fw_site_section_id: configuration.fw_site_section_id,
            fw_mrm_network_id: configuration.fw_mrm_network_id,
            fw_player_profile: configuration.fw_player_profile,
            adServer: configuration.fw_ad_server,
            adManager: configuration.adManager,
            fw_ad_module_js: configuration.fw_ad_module_js,
            html5_ad_server: configuration.fw_ad_server,
            html5_player_profile: configuration.html5_player_profile
        };
        if (isMobile.any()) {
            freewheelSettings.fw_site_section_id = configuration.fw_site_section_id_mob;
        }
        console.log(freewheelSettings);
        if (playerScope.embCode !== null && playerScope.embCode !== '') {
            PLAYER_NAMESPACE.ready(function(PLAYER_NAMESPACE) {
                PLAYER_NAMESPACE.$("#" + playerWraper).html('');
                if ($rootScope.ooyalaMainPlayer !== null) {
                    $rootScope.ooyalaMainPlayer.destroy();
                }
                PlayerAnalyticsService.reportPlayerMetadata(PLAYER_NAMESPACE, playerScope);
                $rootScope.ooyalaMainPlayer = PLAYER_NAMESPACE.Player.create(playerWraper, playerScope.embCode, {
                    autoplay: true,
                    wmode: 'transparent',
                    width: "100%",
                    height: "100%",
                    "shouldDisplayCuePointMarkers": true,
                    layout: '',
                    //  loop:true,
                    omniture: {
                        reportSuiteID: configuration.omniture_rsid
                    },
                    // embedToken: playerScope.embededUrl,
                    "initialTime": playerScope.playhead_seconds,
                    "freewheel-ads-manager": freewheelSettings,
                    onCreate: function(player) {
                        player.mb.subscribe('*', 'hottPage', function(eventName) {
                            // console.log("RECEIVED EVENT: "+eventName);
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYER_CREATED, 'player-creation', playerCreation);
                        player.mb.subscribe("error", "player-error", function(eventName, payload) {
                            console.log("----***** payload OBJECT ********-->>");
                            console.log(payload);
                            //YaVeoErrores.setLanguage('en');
                            var currentlang = Sessions.getLanguage();
                            jQuery('.oo-custom-error-container').css("z-index", 2);
                            if (typeof currentlang != 'undefined') {
                                var lang;
                                if (currentlang === 'en_US') {
                                    lang = 'en';
                                } else if (currentlang === 'es_ES') {
                                    lang = 'es';
                                }
                                YaVeoErrores.setLanguage(lang);
                            } else {
                                YaVeoErrores.setLanguage('en');
                            }
                            var isLoggedInCookieValue = Sessions.getCookie("loggedin");
                            if ((payload.code === "tokenExpired" || payload.code === "invalidToken") && isLoggedInCookieValue == 'true') {
                                //logged in but invalid token
                                $http.get(configuration.server_url + '/getopt?tid=' + Math.random()).success(function(data, status, headers, config) {
                                    var iframe = document.getElementById("embedTokenUrl");
                                    iframe.onload = function() {
                                        playerScope.ajaxSpinner = false;
                                        $route.reload();
                                    }
                                    iframe.src = data.embbdedUrl;
                                }).error(function(data, status, headers, config) {
                                    playerScope.message = 'Unexpected Error';
                                });
                            } else if (payload.code === "invalidToken" && (isLoggedInCookieValue == '' || typeof isLoggedInCookieValue == 'undefined' || isLoggedInCookieValue !== 'true')) {
                                // $rootScope.loginModal(1);
                                console.log("invalidToken");
                                $rootScope.chooseSignUpOrLogin();
                            } else {
                                // if(payload.code ==="sas" && (isLoggedInCookieValue==''||typeof isLoggedInCookieValue=='undefined' ||isLoggedInCookieValue!=='true') )
                                console.log("Player Error event on mobile ");
                                if (isMobile.any()) {
                                    //touch enabled device.
                                    var appmsg = $filter('translate')('TEXT_OPEN_UP_APP');
                                    var retVal = confirm(appmsg);
                                    if (checkert.android) {
                                        console.log("android");
                                        if (retVal == true) {
                                            window.location.href = $rootScope.androidLink[$rootScope.CurrentLang];
                                        }
                                    } else if (checkert.iphone) {
                                        console.log("ios");
                                        if (retVal == true) {
                                            window.location.href = $rootScope.iosLink[$rootScope.CurrentLang];
                                        }
                                    }
                                }
                            }
                            //track error
                            analyticsService.TrackErrorMessage(playerScope.pipedOrginOfPlayback, playerScope.videoOrlive, playerScope.contentProvider, playerScope.currentAssetTitleId, payload.code);
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYBACK_READY, 'player-ready', function() {
                            console.log("player-ready");
                            var show_type = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
                            var content_provider = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
                            var genres = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
                            analyticsService.TrackVideoStart(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.EMBED_CODE_CHANGED, 'player-embedcodechanged', function(eventname, itm) {
                            console.log('**************** Embed Code Changed');
                            console.log(itm);
                            $rootScope.newEmbedCodeLoaded = true;
                            $rootScope.setNextWidgetData(null);
                            //                                    console.log("player-embedcodechanged");
                            //                                    console.log(itm);
                            //                                    playerTimeChangedBelow10=0;
                            //                                    console.log("playTimeCount10="+playerTimeChangedBelow10);
                            //                                    var embdcode = (typeof itm.embedCode == 'undefined')? itm:itm.embedCode;
                            //                                    playerScope.setMetadata(embdcode, true);
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PAUSED, "player-paused", function() {
                            //console.log(Sessions.getLanguage());
                            var show_type = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
                            var content_provider = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
                            var genres = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
                            if (playerScope.videoOrlive == "video") {
                                analyticsService.TrackVideoOnDemandStopCompletePauseClose(playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres, $rootScope.currentDurationProgress);
                            }
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.DESTROY, "player-close", function() {
                            //console.log(Sessions.getLanguage());
                            if (playerScope.videoOrlive == "video") {
                                var show_type = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
                                var content_provider = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
                                var genres = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
                                analyticsService.TrackVideoOnDemandStopCompletePauseClose(playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres, $rootScope.currentDurationProgress);
                            }
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYHEAD_TIME_CHANGED, 'player-PLAYHEAD_TIME_CHANGED', function(eventName, payload) {
                            showUpNextWidget(playerScope, payload);
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAYED, "player-played", function() {
                            //  console.log("played end event triggered");
                            // console.log(window.location.search);
                            //for continuous play-back
                            playerScope.playhead_seconds = 0;
                            if (($routeParams.isPlayAll === true || $routeParams.isPlayAll === "true") && $routeParams.next !== 'undefined') {
                                console.log("isplayall");
                                if (typeof $routeParams.next !== 'undefined' && $routeParams.next !== '') {
                                    var nextIndex = parseInt($routeParams.next);
                                    var playItem = $rootScope.playListStack[nextIndex];
                                    $rootScope.$apply(function() {
                                        $location.search('next', playItem.nextIndex);
                                        $location.search('titleId', playItem.id);
                                        $location.search('isPlayAll', 'true');
                                        $location.path("/" + playItem.source);
                                        console.log($location.path());
                                    });
                                }
                            } else if (typeof playerScope.titleEmbedCodeArr !== 'undefined' && playerScope.pagename === 'tv') {
                                playNextEpisode(playerScope, player);
                            } else if (typeof playerScope.titleEmbedCodeArr !== 'undefined' && playerScope.pagename === 'movie') {
                                console.log("movie page");
                                console.log(playerScope.titleEmbedCodeArr);
                                console.log("movie page");
                                //                                        playerScope.initalLoad=false;
                                //                                        console.log("index is of asset is="+playerScope.initialCount);
                                //                                        var nextItem=playerScope.titleEmbedCodeArr[playerScope.initialCount];
                                //                                        if(typeof nextItem !=='undefined' && nextItem!==null){
                                //                                            console.log(nextItem);
                                //                                            player.setEmbedCode(nextItem.embed_code);
                                //                                            playerScope.initialCount++;
                                //                                        }
                                playerScope.initalLoad = false;
                                if (typeof playerScope.titleEmbedCodeArr[0] !== 'undefined' && playerScope.titleEmbedCodeArr[0] !== null) {
                                    var nextItem = playerScope.titleEmbedCodeArr[0];
                                    console.log(nextItem);
                                    player.setEmbedCode(nextItem.embed_code);
                                    playerScope.embCode = nextItem.embed_code;
                                }
                                //
                            }
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.CONTENT_TREE_FETCHED, "player-content-tree", function(id, object) {
                            //console.log(Sessions.getLanguage());
                            if (playerScope.initalLoad == false) {
                                // console.log("play event triggered content tree");
                                var embdcode = (typeof object.embedCode == 'undefined') ? '' : object.embedCode;
                                playerScope.populateMetadata(true, embdcode);
                            }
                        });
                        player.mb.subscribe(PLAYER_NAMESPACE.EVENTS.PLAY, "player-play", function() {
                            console.log("play event triggered");
                            //.innerWrapper .oo-custom-error-container
                            jQuery('.oo-custom-error-container').css("z-index", '');
                            //(pipedOrginOfPlayback,movie_titleORshowname_Seasonid_Episodeid,Content_ID,propNine)
                            console.log("tiitle id is" + playerScope.currentAssetTitleId);
                            console.log(playerScope.analyticPagename);
                            var show_type = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.show_type != 'undefined') ? playerScope.assetData.show_type : "";
                            var content_provider = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.content_provider != 'undefined') ? playerScope.assetData.content_provider : "";
                            var genres = (typeof playerScope.assetData != 'undefined' && playerScope.assetData.genres != 'undefined') ? playerScope.assetData.genres : "";
                            analyticsService.TrackVideoPlay(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
                            if (playerScope.videoOrlive == "video") {
                                analyticsService.TrackVideoOnDemand(playerScope.analyticPagename, playerScope.movie_titleORshowname_Seasonid_Episodeid, playerScope.currentAssetTitleId, playerScope.propNine, playerScope.videoOrlive, show_type, content_provider, genres);
                            }
                        });
                        player.mb.publish('play');
                    }
                });
            });
        } else {
            if ($rootScope.ooyalaMainPlayer !== null) {
                $rootScope.ooyalaMainPlayer.destroy();
            }
        }
    };
    this.destroyPlayers = function() {
        console.log("destroy player");
        if ($rootScope.ooyalaMainPlayer !== null) {
            $rootScope.ooyalaMainPlayer.destroy();
        }
    };
    this.playListVideos = function(ptype, SeriesID, SeasonID) {
        var relUrl;
        if (ptype === 'seasons') {
            relUrl = '/tv/getPlayList?play_list_type=' + ptype + '&series_id=' + SeriesID + '&season_number=' + SeasonID;
        } else {
            relUrl = '/tv/getPlayList?play_list_type=' + ptype;
        }
        var promise = $http.get(configuration.server_url + relUrl).then(function(response, headers) {
            return response.data;
        });
        return promise;
    };
    /**
     *
     * @param {type} playListType
     * admin,tv
     * @returns {playListStack}
     */
    this.playAllVideos = function(playListType, playListsItems) {
        var playListArr = [];
        if (playListType === 'watchListPlayAll') {
            console.log("inside");
            console.log(playListsItems);
            playListArr = processWatchList(playListsItems);
            return playListArr;
        } else if (playListType === 'tvShowPlayAll') {
            //play all related episode;
            console.log("play tv shows inside");
            playListArr = processWatchList(playListsItems);
            return playListArr;
        }

        function processWatchList(watchLists) {
            var playList = [];
            if (typeof watchLists === "undefined" || watchLists === '' || watchLists === null) {
                return playList;
            }
            var nextIndex = 0;
            for (var i = 0; i < watchLists.length; i++) {
                var item = {};
                console.log(watchLists[i]);
                if (watchLists[i].showtype == "Season") {
                    SearchService.GetEpisodeListBySeriesId(watchLists[i].SeriesID, watchLists[i].SeasonID).then(function(episodes) {
                        //episodes
                    });
                }
                if (watchLists[i].showtype !== "Season") {
                    console.log(watchLists[i].showtype);
                    item.title_id = watchLists[i].id;
                    item.videoType = watchLists[i].source;
                    nextIndex = nextIndex + 1;
                    if (typeof watchLists[nextIndex] == 'undefined') {
                        // does not exist
                        item.next = null;
                    } else {
                        // does exist
                        item.next = nextIndex;
                    }
                    playList.push(item);
                }
            }
            return playList;
        }

        function watchVideoPlayer(isBacklist, scope) {
            scope.ajaxEpisodeloader = true;
            var accessToken = Sessions.getCookie('accessToken');
            $http.get(configuration.server_url + '/watchplayer?titleId=' + $routeParams.titleId + '&uid=' + $rootScope.userid).success(function(data, status, headers, config) {
                scope.embededUrl = data.embbdedUrl;
            }).error(function(data, status, headers, config) {
                scope.message = 'Unexpected Error';
            });
        }
    }

    function getSimilarContent(embedCode, scope) {
        $http({
            method: 'Get',
            url: "/search/getSimilarOrDiscoveryItems?embed_code=" + embedCode
        }).success(function(data, status, headers, config) {
            if (typeof data.thumblistCarouselOneArr !== 'undefined' && data.thumblistCarouselOneArr.length > 0) {
                console.log('we have recommendations!');
                var nextEpisodeTitleId = data.thumblistCarouselOneArr[0].titleId;
                $http({
                    method: 'Get',
                    url: "/singleasset/getSigleAssetMetadata?titleId=" + nextEpisodeTitleId
                }).success(function(data, status, headers, config) {
                    console.log('recomemded content');
                    console.log(data);
                    var nextEpisode = data;
                    nextEpisode.title = nextEpisode[Sessions.getLanguage()].title_medium;
                    nextEpisode.episodeInfo = (!!nextEpisode.season_id ? 'Season ' + nextEpisode.season_id : '') + ' ' + (!!nextEpisode.episode_id ? 'Episode ' + nextEpisode.episode_id : '');
                    nextEpisode.image = nextEpisode.thumbnail;
                    $rootScope.setNextWidgetData(nextEpisode);
                }).error(function(data, status, headers, config) {
                    console.log('Unexpected Error');
                    console.log(data);
                });
            } else return null;
        }).error(function(data, status, headers, config) {
            console.log('Unexpected Error');
            console.log(data);
        });
    }

    function showUpNextWidget(playerScope, currentProgress) {
        var currentEpisodeIndex, currentEpisode, currentEpisodeDuration;
        var nextEpisodeindex, nextEpisode, nextEpisodeName;
        if (!!$rootScope.upNextWidget) return;
        if (typeof currentProgress === 'undefined') return;
        if (typeof playerScope.titleEmbedCodeArr !== 'undefined' && playerScope.pagename === 'tv') {
            currentEpisodeIndex = functiontofindIndexByKeyValue(playerScope.titleEmbedCodeArr, 'titleId', playerScope.currentAssetTitleId);
            currentEpisode = playerScope.titleEmbedCodeArr[currentEpisodeIndex];
            currentEpisodeDuration = currentEpisode.duration;
            console.log(currentProgress + ' of ' + currentEpisodeDuration);
            if ($rootScope.newEmbedCodeLoaded && currentProgress > 5) return; // Work around for Ooyala Player bug where it sends ticks from
            $rootScope.newEmbedCodeLoaded = false; // last play a couple of times after loading a new embed code
            if (currentProgress < currentEpisodeDuration - 20) return;
            if (typeof currentEpisodeIndex !== 'undefined' && currentEpisodeIndex !== 'null') {
                nextEpisodeindex = parseInt(currentEpisodeIndex) + 1;
                nextEpisode = playerScope.titleEmbedCodeArr[nextEpisodeindex];
                if (typeof nextEpisode !== 'undefined' && nextEpisode !== 'null') {
                    nextEpisodeName = nextEpisode[Sessions.getLanguage()]['show_name'].split(',');
                    nextEpisode.title = nextEpisodeName[0];
                    nextEpisode.episodeInfo = (nextEpisodeName[1] ? nextEpisodeName[1] : '') + ' ' + (nextEpisodeName[2] ? nextEpisodeName[2] : '');
                    $rootScope.setNextWidgetData(nextEpisode, true);
                } else {
                    getSimilarContent(currentEpisode.embed_code);
                }
            }
        }
    }
    $rootScope.setNextWidgetData = function(nextEpisode, forceApply) {
        if (!nextEpisode) {
            console.log('Clear Next Widget');
            $rootScope.upNextEpisode = null;
            $rootScope.upNextWidget = false;
        } else {
            console.log('Show Next Widget');
            console.log(nextEpisode);
            $rootScope.upNextEpisode = nextEpisode;
            $rootScope.upNextWidget = true;
        }
        if (forceApply) $rootScope.$apply();
    }

    function playNextEpisode(playerScope, player) {
            var playedItem, indexOfPlayedItem;
            var nextEpisodeindex, nextEpisode;
            //$scope.currentAssetTitleId
            if (!player) player = $rootScope.ooyalaMainPlayer;
            if (typeof playerScope.titleEmbedCodeArr !== 'undefined' && playerScope.pagename === 'tv') {
                // console.log(playerScope.titleEmbedCodeArr);
                playedItem = player.getItem();
                // console.log(playedItem.embedCode);
                indexOfPlayedItem = functiontofindIndexByKeyValue(playerScope.titleEmbedCodeArr, 'titleId', playerScope.currentAssetTitleId);
                // console.log("index is="+indexOfPlayedItem);
                // console.log("titleid id="+playerScope.currentAssetTitleId);
                // console.log(playerScope.titleEmbedCodeArr.length);
                if (typeof indexOfPlayedItem !== 'undefined' && indexOfPlayedItem !== 'null') {
                    nextEpisodeindex = parseInt(indexOfPlayedItem) + 1;
                    nextEpisode = playerScope.titleEmbedCodeArr[nextEpisodeindex];
                    if (typeof nextEpisode !== 'undefined' && nextEpisode !== 'null') {
                        $rootScope.playVideo(nextEpisode, playerScope, player, true);
                        return true;
                    } else {
                        getSimilarContent(playedItem.embedCode);
                    }
                }
            }
        }
        /**
         * Play a video on the player and set the data in scope for the currently playing video
         *
         * @params videoDetails Required format should be {'embed_code':EmbedCodeForVideo, 'titleId': TitleIdForVideo }
         * @params playerScope  Optional scope object
         * @params player       Optional player object
         */
    $rootScope.playVideo = function(videoDetails, playerScope, player, forceApply) {
        if (!playerScope) playerScope = $rootScope;
        if (!player) player = $rootScope.ooyalaMainPlayer;
        player.pause();
        playerScope.initalLoad = false;
        playerScope.embCode = videoDetails.embed_code;
        playerScope.currentAssetTitleId = videoDetails.titleId;
        $rootScope.lastEmbedCode = player.getEmbedCode();
        player.setEmbedCode(videoDetails.embed_code);
        if (forceApply) playerScope.$apply();
        player.play();
    }
}]);